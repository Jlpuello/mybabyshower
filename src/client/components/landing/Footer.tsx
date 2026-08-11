export const Footer = () => {
  return (
    <footer className="bg-textPrimary text-white py-3.5 px-4 w-full">
      <div className="max-w-5xl mx-auto text-center flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-textLight">
        <p>Hecho con ❤️ para celebrar una nueva vida</p>
        <p>© {new Date().getFullYear()} Baby Shower by <a href="https://jlp.do" target="_blank" rel="noopener noreferrer">JLPuello</a></p>
      </div>
    </footer>
  );
};
