import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <section className="not-found">
        <h1>404</h1>
        <p>Página não encontrada.</p>
        <p>
          <Link href="/">Voltar para o início</Link>
        </p>
      </section>
    </div>
  );
}
