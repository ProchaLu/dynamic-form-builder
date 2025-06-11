import { useCallback } from 'react';
import {
  type FieldType,
  type FormField,
  useForm,
} from '../context/FormContext';

export function useFormFields() {
  const { state, dispatch } = useForm();

  const addField = useCallback(
    (type: FieldType) => {
      const newField: FormField = {
        id: crypto.randomUUID(),
        type,
        label: '',
        placeholder: '',
        required: false,
        // If the field type is 'dropdown', initialize options with an empty array
        // to display the option input in the UI
        options: type === 'dropdown' ? [''] : undefined,
        ...(type === 'text' && {
          minLength: undefined,
          maxLength: undefined,
        }),
        ...(type === 'number' && {
          min: undefined,
          max: undefined,
          step: undefined,
        }),
        ...(type === 'date' && {
          minDate: undefined,
          maxDate: undefined,
        }),
      };

      dispatch({ type: 'ADD_FIELD', payload: newField });
    },
    [dispatch],
  );

  const removeField = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_FIELD', payload: id });
    },
    [dispatch],
  );

  const updateField = useCallback(
    (id: string, updates: Partial<FormField>) => {
      dispatch({ type: 'UPDATE_FIELD', payload: { id, updates } });
    },
    [dispatch],
  );

  const reorderFields = useCallback(
    (fields: FormField[]) => {
      dispatch({ type: 'REORDER_FIELDS', payload: fields });
    },
    [dispatch],
  );

  const setFormName = useCallback(
    (name: string) => {
      dispatch({ type: 'SET_FORM_NAME', payload: name });
    },
    [dispatch],
  );

  return {
    fields: state.fields,
    formName: state.name,
    errors: state.errors,
    addField,
    removeField,
    updateField,
    reorderFields,
    setFormName,
  };
}
