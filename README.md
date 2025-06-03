# Dynamic Form Builder

A flexible and customizable form builder for dynamic form generation in your applications.

## Features

- Drag-and-drop form creation
- Custom field types and validation
- Real-time preview
- Export/import form configurations

## Installation

### Database

Create a PostgreSQL Database

```sql
CREATE DATABASE <database name>;
CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
\connect <database name>
CREATE SCHEMA <schema name> AUTHORIZATION <user name>;
```
