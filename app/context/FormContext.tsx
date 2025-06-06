'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useReducer } from 'react';
import { z } from 'zod';

// Types
export type FieldType = 'text' | 'number' | 'date' | 'dropdown';

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  // Text field validation
  minLength?: number;
  maxLength?: number;
  // Number field validation
  min?: number;
  max?: number;
  step?: number;
  // Date field validation
  minDate?: string;
  maxDate?: string;
  // Dropdown options
  options?: string[];
};

export type FormState = {
  name: string;
  fields: FormField[];
  errors: {
    name?: string;
    fields: { [key: string]: { label?: string; options?: string } };
  };
};

// Action Types
type FormAction =
  | { type: 'SET_FORM_NAME'; payload: string }
  | { type: 'ADD_FIELD'; payload: FormField }
  | { type: 'REMOVE_FIELD'; payload: string }
  | {
      type: 'UPDATE_FIELD';
      payload: { id: string; updates: Partial<FormField> };
    }
  | { type: 'REORDER_FIELDS'; payload: FormField[] }
  | { type: 'SET_ERRORS'; payload: FormState['errors'] }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_FORM' };

// Initial State
const initialState: FormState = {
  name: '',
  fields: [],
  errors: {
    fields: {},
  },
};

// Validation Schema
const fieldSchema = z
  .object({
    id: z.string(),
    type: z.enum(['text', 'number', 'date', 'dropdown']),
    label: z.string().min(1, 'Label cannot be empty'),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
    value: z.any().optional(),
  })
  // Use superRefine for custom validation logic specific to dropdown fields:
  // - One option is provided
  // - Prevent options from being empty strings
  .superRefine((field, context) => {
    if (field.type === 'dropdown') {
      if (!field.options || field.options.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Dropdown options cannot be empty',
          path: ['options'],
        });
      } else if (field.options.some((option) => !option.trim())) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Dropdown options cannot be empty strings',
          path: ['options'],
        });
      }
    }
  });

const formSchema = z.object({
  name: z.string().min(1, 'Form name cannot be empty'),
  fields: z.array(fieldSchema),
});

// Reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FORM_NAME':
      return {
        ...state,
        name: action.payload,
        errors: {
          ...state.errors,
          name: undefined,
        },
      };

    case 'ADD_FIELD':
      return {
        ...state,
        fields: [...state.fields, action.payload],
      };

    case 'REMOVE_FIELD':
      return {
        ...state,
        fields: state.fields.filter((field) => field.id !== action.payload),
        errors: {
          ...state.errors,
          fields: Object.fromEntries(
            Object.entries(state.errors.fields).filter(
              ([key]) => key !== action.payload,
            ),
          ),
        },
      };

    case 'UPDATE_FIELD':
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === action.payload.id
            ? { ...field, ...action.payload.updates }
            : field,
        ),
        errors: {
          ...state.errors,
          fields: Object.fromEntries(
            Object.entries(state.errors.fields)
              .filter(([key]) => key !== action.payload.id)
              .map(([key, value]) => [key, value || {}]),
          ),
        },
      };

    case 'REORDER_FIELDS':
      return {
        ...state,
        fields: action.payload,
      };

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {
          name: undefined,
          fields: {},
        },
      };

    case 'RESET_FORM':
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

// Context
const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  validateForm: () => boolean;
} | null>(null);

// Provider Component
export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const validateForm = useCallback(() => {
    const result = formSchema.safeParse({
      name: state.name,
      fields: state.fields,
    });

    if (!result.success) {
      const errors: FormState['errors'] = {
        name: result.error.formErrors.fieldErrors.name?.[0],
        fields: {},
      };

      result.error.errors.forEach((error) => {
        if (error.path[0] === 'fields') {
          const index = error.path[1];
          const key = error.path[2];
          if (typeof index === 'number' && state.fields[index] !== undefined) {
            const fieldId = state.fields[index].id;
            if (!errors.fields[fieldId]) errors.fields[fieldId] = {};
            if (key === 'label') errors.fields[fieldId].label = error.message;
            if (key === 'options')
              errors.fields[fieldId].options = error.message;
          }
        }
      });

      dispatch({ type: 'SET_ERRORS', payload: errors });
      return false;
    }

    dispatch({ type: 'CLEAR_ERRORS' });
    return true;
  }, [state.name, state.fields, dispatch]);

  return (
    <FormContext.Provider value={{ state, dispatch, validateForm }}>
      {children}
    </FormContext.Provider>
  );
}

// Custom Hook
export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
