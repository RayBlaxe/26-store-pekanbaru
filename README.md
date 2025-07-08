# 26 Store Pekanbaru E-Commerce

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/raihans-projects-84f1bec6/v0-26-store-pekanbaru-e-commerce)

This is an e-commerce application built with Next.js, featuring a customer-facing storefront and an admin panel for managing the store.

## Features

**Customer Facing:**
*   **Product Catalog:** Browse and view products.
*   **Shopping Cart:** Add products to a cart and manage them.
*   **Checkout Process:** Securely place orders.
*   **Order Tracking:** View the status of past orders.
*   **User Profiles:** Manage personal information and order history.

**Admin Panel:**
*   **Dashboard:** Overview of sales and store activity.
*   **Product Management:** Add, edit, and remove products.
*   **Customer Management:** View and manage customer data.
*   **Sales Management:** Track sales and revenue.
*   **Reporting:** Generate sales and inventory reports.

## Project Structure

The project follows a standard Next.js application structure:

*   `app/`: Contains all the routes, pages, and layouts for the application.
    *   `app/admin/`: Specific routes and pages for the admin panel.
    *   `app/cart/`: Cart page.
    *   `app/checkout/`: Checkout page.
    *   `app/orders/`: Order history page.
    *   `app/profile/`: User profile page.
    *   `app/page.tsx`: The main landing page of the store.
    *   `app/layout.tsx`: The main layout for the application.
    *   `app/globals.css`: Global styles for the application.
*   `components/`: Contains reusable UI components used throughout the application.
    *   `components/ui/`: Likely contains pre-built or Shadcn/UI components.
    *   `components/admin-layout.tsx`: Layout specific to the admin section.
    *   `components/customer-layout.tsx`: Layout specific to the customer-facing sections.
*   `public/`: Stores static assets like images, fonts, and icons.
    *   `public/images/`: Contains images used in the application, including product images and admin panel screenshots.
*   `lib/`: Contains utility functions and helper modules (e.g., `lib/utils.ts`).
*   `hooks/`: Contains custom React hooks used in the application (e.g., `hooks/use-toast.ts`, `hooks/use-mobile.tsx`).
*   `styles/`: Contains global styles (though `app/globals.css` is also present and common in newer Next.js versions).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18.x or newer recommended)
*   npm, yarn, or pnpm (this project uses `bun.lockb`, `pnpm-lock.yaml` suggesting pnpm or bun might be preferred)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```
3.  Install dependencies. Choose one of the following based on your preferred package manager (pnpm is recommended if `pnpm-lock.yaml` is the primary lockfile, or bun if `bun.lockb` is primary):
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Running the Development Server

Once the dependencies are installed, you can start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the `package.json` file, you will find the following scripts:

*   `dev`: Runs the app in development mode with hot reloading.
*   `build`: Builds the application for production usage.
*   `start`: Starts a Next.js production server.
*   `lint`: Lints the codebase using Next.js's built-in ESLint configuration.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/) (v15.x)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** Likely [Shadcn/UI](https://ui.shadcn.com/) (inferred from `components/ui` and dependencies like `@radix-ui/*`)
*   **Forms:** [React Hook Form](https://react-hook-form.com/)
*   **Schema Validation:** [Zod](https://zod.dev/)
*   **Linting:** [ESLint](https://eslint.org/)
*   **Package Managers Detected:** `bun.lockb` (Bun), `pnpm-lock.yaml` (pnpm) - use the one most recently updated or preferred by the project.

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com/), the platform from the creators of Next.js.
The live deployment can be found at: **[https://vercel.com/raihans-projects-84f1bec6/v0-26-store-pekanbaru-e-commerce](https://vercel.com/raihans-projects-84f1bec6/v0-26-store-pekanbaru-e-commerce)**

This repository stays in sync with deployments on [v0.dev](https://v0.dev).

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## License

This project is currently unlicensed. (Consider adding an MIT License if it's an open-source project).
