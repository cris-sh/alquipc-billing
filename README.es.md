# 🖥️ ALQUIPC - Sistema de Facturación

[![English](https://img.shields.io/badge/lang-english-red.svg)](https://github.com/cris-sh/alquipc-billing/blob/master/README.md)
[![Spanish](https://img.shields.io/badge/lang-spanish-yellow.svg)](https://github.com/cris-sh/alquipc-billing/blob/master/README.es.md)

ALQUIPC es un sistema de facturación moderno para el alquiler de equipos de cómputo. Diseñado siguiendo los estándares de calidad ISO/IEC 25010, permite calcular precios de alquiler con diferentes variables como ubicación, duración y cantidad de equipos.

## ✨ Características

- **Generación automática de ID de cliente** - Cada orden recibe un ID único
- **Cálculo dinámico de precios** con los siguientes factores:
  - ✅ Número de equipos (mínimo 2)
  - ✅ Días de alquiler inicial
  - ✅ Días adicionales (con 2% de descuento)
  - ✅ Ubicación (dentro de la ciudad, fuera de la ciudad con 5% de recargo, o en el establecimiento con 5% de descuento)
- **Facturación digital** con resumen detallado
- **Exportación a PDF** de la factura
- **Simulación de envío por correo electrónico**
- **Modo oscuro/claro** para mejor experiencia de usuario
- **Diseño responsivo** adaptable a dispositivos móviles y de escritorio

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/yourusername/alquipc-billing.git

# Entrar al directorio
cd alquipc-billing

# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun dev
```

## 🧪 Tests

El proyecto incluye pruebas unitarias para verificar la correcta funcionalidad del cálculo de precios:

```bash
# Ejecutar pruebas
bun test

# Ejecutar pruebas con cobertura
bun test:coverage
```

## 🛠️ Tecnologías utilizadas

- **TypeScript** - Lenguaje de programación
- **Vite** - Build tool y servidor de desarrollo
- **TailwindCSS** - Framework de CSS
- **jsPDF** - Generación de PDF
- **html2canvas-pro** - Conversión de HTML a imagen para PDF
- **Bun** - Entorno de pruebas

## 📁 Estructura del proyecto

```
alquipc-billing/
├── src/
│   ├── models/         # Definiciones de tipos y interfaces
│   ├── services/       # Servicios para cálculos y API
│   ├── main.ts         # Punto de entrada de la aplicación
│   └── style.css       # Estilos globales
├── tests/              # Pruebas unitarias
├── public/             # Activos públicos
├── index.html          # HTML principal
├── vite.config.ts      # Configuración de Vite
└── package.json        # Dependencias y scripts
```

## 📊 Casos de uso

El sistema de facturación maneja varios escenarios de alquiler:

1. **Alquiler dentro de la ciudad** - Sin cargos adicionales
2. **Alquiler fuera de la ciudad** - Recargo del 5%
3. **Alquiler en el establecimiento** - Descuento del 5%
4. **Días adicionales** - Descuento del 2% por cada día extra

## 📱 Capturas de pantalla

Formulario
![Formulario de Facturación](https://i.imgur.com/e94RzcX.png)

Factura Generada
![Factura Generada](https://i.imgur.com/kgawDWR.png)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 👨‍💻 Autor

Desarrollado por [Cristian Duarte](https://www.enux.dev)
