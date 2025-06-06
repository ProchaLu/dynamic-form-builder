# Dynamic Form Builder

[Live Demo](https://dynamic-form-builder-cyan-kappa.vercel.app)

A modern, accessible form builder application that allows users to create, manage, and submit dynamic forms. Built with Next.js, TypeScript, and PostgreSQL.

## Features

- Create and manage dynamic forms
- Support for multiple field types (text, number, date, dropdown)
- Drag and drop field reordering
- Form validation
- Responsive design
- Accessible UI
- Database integration
- Type safety with TypeScript

## Screenshots

### Dynamic Form Builder

<img width="1435" alt="Form Builder Overview" src="https://github.com/user-attachments/assets/080a212b-6877-469e-97b8-6df62ad2567a" />

**Form Name and Label are always required**
<img width="1435" alt="Validation Example" src="https://github.com/user-attachments/assets/a0e7c9dd-be78-4184-abfe-fc068c12853d" />

<img width="1435" alt="Dropdown Validation" src="https://github.com/user-attachments/assets/f59484b2-b544-4166-b923-76343e40b0b6" />

**Submitted Forms are displayed in the Custom Forms section**
<img width="1435" alt="Submitted Forms" src="https://github.com/user-attachments/assets/a4f36dc0-75de-4d24-b3bf-1cfcb6e22a7e" />

---

### Single Form Page

<img width="1435" alt="Single Form Page" src="https://github.com/user-attachments/assets/d344e0e6-80a5-4d9a-93fa-02a532b60f06" />

**If a field is required, the application will throw an error**
<img width="1435" alt="Required Field Error" src="https://github.com/user-attachments/assets/5347aa1a-c66e-4aad-9f82-9064e8ba0cec" />
<img width="1435" alt="Another Error Example" src="https://github.com/user-attachments/assets/fd424c35-1736-4077-8f2a-c8ea28f6eddf" />

---

### Responsive Design

This app is fully responsive:

<img width="217" alt="Mobile View" src="https://github.com/user-attachments/assets/2b695d69-9e43-4b53-9a93-9a5f7ee5a439" />

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **State Management**: React Context API
- **Form Validation**: Zod
- **Drag and Drop**: @dnd-kit

### Key Directories and Files

- **`app/`**: Contains all the application code

  - `api/`: API routes for form creation and submission
  - `context/`: React Context for global state management
  - `components/`: Reusable React components
  - `lib/`: Utility functions and type definitions

- **`migrations/`**: Database migration files

  - Contains SQL schema changes and version control

- **`public/`**: Static assets like images and fonts

- **Configuration Files**:
  - `.env.example`: Template for environment variables
  - `next.config.js`: Next.js configuration
  - `tailwind.config.ts`: Tailwind CSS customization
  - `tsconfig.json`: TypeScript compiler options

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dynamic-form-builder.git
cd dynamic-form-builder
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory

4. Start the development server:

```bash
pnpm run
```

## Database Setup

Copy the `.env.example` file to a new file called `.env` (ignored from Git) and fill in the necessary information.

Then, connect to the built-in `postgres` database as administrator in order to create the database:

### Windows

If it asks for a password, use `postgres`.

```bash
psql -U postgres
```

### macOS

```bash
psql postgres
```

### Linux

```bash
sudo -u postgres psql
```

### Create Database

Once you have connected, run the following to create the database:

```sql
CREATE DATABASE <database name>;
CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
\connect <database name>
CREATE SCHEMA <schema name> AUTHORIZATION <user name>;
```

Quit `psql` using the following command:

```bash
\q
```

**Windows and macOS:**

```bash
psql -U <user name> <database name>
```

**Linux:**

```bash
sudo -u <user name> psql -U <user name> <database name>
```

## Architecture & Design Decisions

### State Management Evolution

The application started with a simpler state management approach using `useState` hooks, but evolved to use the Context API as the application grew. This evolution demonstrates important lessons in React application architecture:

#### Initial Approach (useState)

```typescript
// Simple state management with useState
const [fields, setFields] = useState<FormField[]>([]);
const [formName, setFormName] = useState('');
```

**Pros:**

- Simpler to understand and implement
- Good for small applications
- Less boilerplate code
- Easier to debug

**Cons:**

- Prop drilling becomes an issue
- State updates become complex
- Hard to share state between components
- Difficult to maintain as application grows

#### Current Approach (Context API)

```typescript
// Global state management with Context
export const FormContext = createContext<FormContextType | undefined>(
  undefined,
);

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  // ...
}
```

**Pros:**

- Centralized state management
- Easier to share state between components
- Better separation of concerns
- More scalable for larger applications
- Easier to add new features

**Cons:**

- More initial setup required
- More complex
- Need to be careful about unnecessary re-renders

### Database Design

The application uses PostgreSQL with a simple but effective schema:

```sql
-- Forms table
CREATE TABLE forms (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  fields JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Form submissions table
CREATE TABLE form_submissions (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  form_id INTEGER REFERENCES forms(id),
  submitted_data JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

### Component Architecture

The application follows a modular component structure:

- `FormBuilder`: Main form creation interface
- `FormFieldItem`: Individual field configuration
- `FieldTypeSelector`: Field type selection
- `DynamicForm`: Form rendering and submission

## Development Journey

### Challenges & Solutions

1. **State Management Complexity**

   - Started with `useState` for simplicity
   - Switched to Context API as the application grew
   - Implemented proper action types and reducers

2. **Form Validation**

   - Implemented client-side validation
   - Added server-side validation with Zod
   - Created custom validation rules

3. **Drag and Drop**

   - Integrated `@dnd-kit` for field reordering
   - Implemented proper touch support
   - Added keyboard accessibility

4. **Type Safety**
   - Used TypeScript for better type safety
   - Created proper interfaces and types
   - Implemented proper error handling

## Future Improvements

### Short Term

- [ ] Implement proper error boundaries
- [ ] Add form submission success feedback
- [ ] Add unit tests
- [ ] Add End2End tests

### Medium Term

- [ ] User authentication
- [ ] Form templates
- [ ] Custom validation rules
- [ ] Form analytics
- [ ] Export/import functionality

### Long Term

- [ ] Multi-language support
- [ ] Advanced form features
- [ ] Performance optimizations
- [ ] Mobile app

## Performance Considerations

### Current Optimizations

- React Context for state management
- Proper component memoization
- Efficient database queries
- Optimized form validation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://github.com/colinhacks/zod)
- [@dnd-kit](https://dndkit.com/)
