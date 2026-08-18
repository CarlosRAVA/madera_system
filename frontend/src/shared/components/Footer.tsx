export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-border mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-beige/60">
        <p>© {year} Leños Rellenos. Todos los derechos reservados.</p>
        <p>Hecho con leña, humo y buen sazón.</p>
      </div>
    </footer>
  );
}
