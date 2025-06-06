# Dynamic Form Builder

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

3. Create a `.env` file in the root directory:

```env
DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database
```

4. Start the development server:

```bash
npm run dev
```

## Database Setup

If you don't have PostgreSQL installed yet, follow the instructions from the PostgreSQL step in [UpLeveled's System Setup Instructions](https://github.com/upleveled/system-setup/blob/master/readme.md).

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
