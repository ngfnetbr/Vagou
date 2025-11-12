# AI Rules for VAGOU Application

This document outlines the technical stack and specific guidelines for using libraries within the VAGOU application. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen technologies.

## Tech Stack Overview

The VAGOU application is built using a modern web development stack, focusing on performance, developer experience, and a robust user interface.

*   **Vite**: A fast build tool that provides an instant development server and optimized builds.
*   **React**: A declarative, component-based JavaScript library for building user interfaces.
*   **TypeScript**: A superset of JavaScript that adds static type definitions, enhancing code quality and developer productivity.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
*   **shadcn/ui**: A collection of reusable components built with Radix UI and styled with Tailwind CSS, providing accessible and customizable UI elements.
*   **React Router DOM**: The standard library for client-side routing in React applications.
*   **@tanstack/react-query**: A powerful library for managing, caching, and synchronizing server state in React.
*   **Lucide React**: A comprehensive icon library for clear and scalable vector icons.
*   **React Hook Form & Zod**: Libraries for efficient form management and schema-based validation.
*   **Sonner**: A modern, accessible, and customizable toast component for notifications.

## Library Usage Rules

To maintain consistency and leverage the benefits of our tech stack, please follow these guidelines when developing:

*   **UI Components**: Always prioritize `shadcn/ui` components for all user interface elements. If a specific component is not available, create a new, small, and focused component using Radix UI primitives and Tailwind CSS. Do not modify existing `shadcn/ui` component files directly.
*   **Styling**: All styling must be done using **Tailwind CSS** utility classes. Avoid writing custom CSS in separate `.css` files for new components or features.
*   **Routing**: Use `react-router-dom` for all navigation and routing within the application. Keep route definitions primarily in `src/App.tsx`.
*   **State Management (Server State)**: For fetching, caching, and updating server data, use `@tanstack/react-query`.
*   **State Management (Client State)**: For simple component-level state, use React's built-in `useState` and `useReducer` hooks.
*   **Forms & Validation**: Implement all forms using `react-hook-form` for state management and `zod` for schema validation.
*   **Icons**: Use icons from the `lucide-react` library.
*   **Notifications**: For displaying user feedback messages (e.g., success, error, info), use the `sonner` toast component.
*   **Project Structure**: Adhere to the existing directory structure:
    *   `src/pages/`: For top-level views/pages.
    *   `src/components/`: For reusable UI components.
    *   `src/hooks/`: For custom React hooks.
    *   `src/lib/`: For utility functions and configurations.
*   **File Naming**: Directory names must be all lower-case. File names may use mixed-case (e.g., `MyComponent.tsx`).
*   **Responsiveness**: All new UI implementations must be responsive and adapt gracefully to different screen sizes.