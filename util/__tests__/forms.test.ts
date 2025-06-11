import { describe, expect, it } from 'vitest';
import {
  type FormAction,
  type FormField,
  formReducer,
  type FormState,
} from '../../app/context/FormContext';

const initialState: FormState = {
  name: '',
  fields: [],
  errors: { fields: {} },
};

describe('formReducer', () => {
  it('should set form name and clear name error', () => {
    const stateWithError = {
      ...initialState,
      errors: { name: 'Form name cannot be empty', fields: {} },
    };
    const action: FormAction = { type: 'SET_FORM_NAME', payload: 'Test Form' };
    const state = formReducer(stateWithError, action);
    expect(state.name).toBe('Test Form');
    expect(state.errors.name).toBeUndefined();
  });

  it('should add a field', () => {
    const field: FormField = { id: '1', type: 'text', label: 'Test' };
    const action: FormAction = { type: 'ADD_FIELD', payload: field };
    const state = formReducer(initialState, action);
    expect(state.fields).toHaveLength(1);
    expect(state.fields[0]).toStrictEqual(field);
  });

  it('should remove a field and its errors', () => {
    const startState: FormState = {
      ...initialState,
      fields: [{ id: '1', type: 'text', label: 'Test' }],
      errors: { name: undefined, fields: { '1': { label: 'Error' } } },
    };
    const action: FormAction = { type: 'REMOVE_FIELD', payload: '1' };
    const state = formReducer(startState, action);
    expect(state.fields).toHaveLength(0);
    expect(state.errors.fields['1']).toBeUndefined();
  });

  it('should update a field and clear its errors', () => {
    const startState: FormState = {
      ...initialState,
      fields: [{ id: '1', type: 'text', label: 'Old' }],
      errors: { name: undefined, fields: { '1': { label: 'Error' } } },
    };
    const action: FormAction = {
      type: 'UPDATE_FIELD',
      payload: { id: '1', updates: { label: 'New' } },
    };
    const state = formReducer(startState, action);
    expect(state.fields[0]?.label).toBe('New');
    expect(state.errors.fields['1']).toBeUndefined();
  });

  it('should reorder fields', () => {
    const startState: FormState = {
      ...initialState,
      fields: [
        { id: '1', type: 'text', label: 'A' },
        { id: '2', type: 'number', label: 'B' },
      ],
    };
    const action: FormAction = {
      type: 'REORDER_FIELDS',
      payload: [
        { id: '2', type: 'number', label: 'B' },
        { id: '1', type: 'text', label: 'A' },
      ],
    };
    const state = formReducer(startState, action);
    expect(state.fields[0]?.id).toBe('2');
    expect(state.fields[1]?.id).toBe('1');
  });

  it('should set and clear errors', () => {
    const errors = { name: 'Error', fields: { '1': { label: 'Error' } } };
    let state = formReducer(initialState, {
      type: 'SET_ERRORS',
      payload: errors,
    });
    expect(state.errors.name).toBe('Error');
    state = formReducer(state, { type: 'CLEAR_ERRORS' });
    expect(state.errors.name).toBeUndefined();
    expect(state.errors.fields).toStrictEqual({});
  });

  it('should reset form', () => {
    const startState: FormState = {
      name: 'Test',
      fields: [{ id: '1', type: 'text', label: 'Test' }],
      errors: { name: 'Error', fields: { '1': { label: 'Error' } } },
    };
    const state = formReducer(startState, { type: 'RESET_FORM' });
    expect(state).toStrictEqual(initialState);
  });

  it('should ignore unknown actions', () => {
    const state = formReducer(initialState, {
      // @ts-expect-error - This is a test for unknown actions
      type: 'UNKNOWN',
    });
    expect(state).toStrictEqual(initialState);
  });
});
