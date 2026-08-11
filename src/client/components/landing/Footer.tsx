export const Footer = () => {
  return (
    <footer className="bg-textPrimary text-white py-8 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-textLight text-sm">
          Hecho con ❤️ para celebrar una nueva vida
        </p>
        <p className="text-textLight text-xs mt-2">
          © {new Date().getFullYear()} Baby Shower Platform
        </p>
      </div>
    </footer>
  );
};
