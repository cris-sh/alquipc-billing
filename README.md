# 🖥️ ALQUIPC - Billing System

[![English](https://img.shields.io/badge/lang-english-red.svg)](https://github.com/cris-sh/alquipc-billing/blob/master/README.md)
[![Spanish](https://img.shields.io/badge/lang-spanish-yellow.svg)](https://github.com/cris-sh/alquipc-billing/blob/master/README.es.md)

ALQUIPC is a modern billing system for computer equipment rental. Designed following ISO/IEC 25010 quality standards, it calculates rental prices with different variables such as location, duration, and number of devices.

## ✨ Features

- **Automatic customer ID generation** - Each order receives a unique ID
- **Dynamic price calculation** with the following factors:
  - ✅ Number of devices (minimum 2)
  - ✅ Initial rental days
  - ✅ Additional days (with 2% discount)
  - ✅ Location (within the city, outside the city with 5% surcharge, or on-premises with 5% discount)
- **Digital invoicing** with detailed summary
- **PDF export** of invoices
- **Email sending simulation**
- **Dark/light mode** for better user experience
- **Responsive design** adaptable to mobile and desktop devices

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/alquipc-billing.git

# Enter the directory
cd alquipc-billing

# Install dependencies
bun install

# Start development server
bun dev
```

## 🧪 Tests

The project includes unit tests to verify correct price calculation functionality:

```bash
# Run tests
bun test

# Run tests with coverage
bun test:coverage
```

## 🛠️ Technologies used

- **TypeScript** - Programming language
- **Vite** - Build tool and development server
- **TailwindCSS** - CSS framework
- **jsPDF** - PDF generation
- **html2canvas-pro** - HTML to image conversion for PDF
- **Bun** - Test environment

## 📁 Project structure

```
alquipc-billing/
├── src/
│   ├── models/         # Type and interface definitions
│   ├── services/       # Services for calculations and API
│   ├── main.ts         # Application entry point
│   └── style.css       # Global styles
├── tests/              # Unit tests
├── public/             # Public assets
├── index.html          # Main HTML
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 📊 Use cases

The billing system handles various rental scenarios:

1. **Rental within the city** - No additional charges
2. **Rental outside the city** - 5% surcharge
3. **On-premises rental** - 5% discount
4. **Additional days** - 2% discount for each extra day

## 📱 Screenshots

Form
![Billing Form](https://i.imgur.com/e94RzcX.png)

Generated Invoice
![Generated Invoice](https://i.imgur.com/kgawDWR.png)

## 📄 License

This project is under the MIT License - see the LICENSE file for more details.

## 👨‍💻 Author

Developed by [Cristian Duarte](https://www.enux.dev)
