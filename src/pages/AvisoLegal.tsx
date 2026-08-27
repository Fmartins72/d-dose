export function AvisoLegal() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-bold" style={{ color: 'var(--color-alerta)' }}>
        Aviso legal
      </h1>

      <div className="flex flex-col gap-4 text-sm">
        <p>
          O D-Dose é uma ferramenta de apoio ao cálculo de dose de fosfina e de diluição de produtos de
          desinsetização. O uso de fosfina e de produtos fitossanitários/desinsetizantes é <strong>restrito a
          aplicadores e profissionais devidamente habilitados</strong>, conforme a legislação vigente (MAPA,
          ANVISA e normas locais).
        </p>

        <p>
          Os resultados apresentados são calculados a partir dos dados cadastrados no aplicativo e servem apenas
          como <strong>apoio à decisão</strong>. Eles não substituem a bula do produto, a orientação de um
          responsável técnico, nem a legislação aplicável. Antes de aplicar qualquer produto, confira sempre a
          bula original, o rótulo e as instruções do fabricante.
        </p>

        <p>
          Utilize sempre os <strong>Equipamentos de Proteção Individual (EPIs)</strong> indicados para cada
          produto e siga as recomendações de segurança, ventilação e reentrada em áreas tratadas.
        </p>

        <p>
          O D-Dose e seus desenvolvedores não se responsabilizam por danos decorrentes do uso incorreto das
          informações calculadas, da aplicação por pessoas não habilitadas, ou do uso de dados incorretos
          cadastrados no sistema.
        </p>
      </div>
    </div>
  )
}
