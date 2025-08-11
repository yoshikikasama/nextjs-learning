# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This repository contains a Next.js learning project with a basic Next.js 15 application using the App Router, TypeScript, and Tailwind CSS.

The main application is located in `next-udemy-basic/` directory:
- `src/app/` - Next.js App Router pages and layouts
- `src/app/page.tsx` - Main homepage component
- `src/app/layout.tsx` - Root layout with Geist font configuration
- `public/` - Static assets (SVG icons)

## Development Environment

Working directory should be `next-udemy-basic/` for all npm commands.

Key commands (run from `next-udemy-basic/` directory):
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

- **Next.js 15.3.4** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **ESLint** with Next.js config
- **Geist fonts** (sans and mono) from Google Fonts

## Code Conventions

- Uses TypeScript with strict mode enabled
- Components use functional component syntax with TypeScript
- Tailwind CSS classes for styling
- Path alias `@/*` maps to `./src/*`
- Font variables defined in layout: `--font-geist-sans` and `--font-geist-mono`