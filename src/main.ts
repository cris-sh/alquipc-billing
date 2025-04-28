import { RentalLocation } from "./models/Rental";
import { ApiService } from "./services/MockAPI";
import { PriceCalculator } from "./services/PriceCalculator";
import { jsPDF } from "jspdf";
import "./style.css";
import html2canvas from "html2canvas-pro";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-4 md:mb-0">
          <i class="fas fa-laptop-code text-3xl mr-4"></i>
          <div>
            <h1 class="text-3xl font-bold tracking-tight">ALQUIPC</h1>
            <p class="text-sm text-blue-100">Sistema de Facturación de Alquiler de Equipos</p>
          </div>
        </div>
        <div class="flex items-center">
          <div class="hidden md:block text-right mr-6">
            <div class="text-sm text-blue-100">Servicio al Cliente</div>
            <div class="text-lg font-semibold">01 8000 123 456</div>
          </div>
          <button id="theme-toggle" class="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors" 
            aria-label="Cambiar tema">
            <i class="fas fa-moon text-yellow-300"></i>
          </button>
        </div>
      </div>
    </header>
    
    <main class="container mx-auto p-4 md:p-6 flex-grow">
      <div class="max-w-4xl mx-auto">
        <!-- Título de sección con animación -->
        <div class="slide-up">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-file-invoice-dollar mr-3 text-blue-600"></i>
            Nueva Orden de Alquiler
          </h2>
          <p class="text-gray-600 mb-8">Complete el formulario para generar una nueva orden de alquiler y factura.</p>
        </div>
        
        <!-- Formulario principal con tarjeta y sombra elevada -->
        <div class="bg-white rounded-xl shadow-xl p-6 md:p-8 fade-in mb-8">
          <form id="rental-form" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label for="client-id" class="block text-sm font-medium text-gray-700 mb-1 items-center">
                  <i class="fas fa-id-card text-blue-500 mr-2"></i>
                  ID Cliente
                </label>
                <div class="flex">
                  <input type="text" id="client-id" aria-describedby="client-id-help"
                    class="bg-gray-50 rounded-l-lg py-3 px-4 w-full text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readonly placeholder="Generate un ID de cliente">
                  <button type="button" id="generate-id" 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg transition-colors flex items-center">
                    <i class="fas fa-magic mr-2"></i> Generar
                  </button>
                </div>
                <p id="client-id-help" class="mt-1 text-sm text-gray-500 flex items-center">
                  <i class="fas fa-info-circle mr-1 text-blue-400"></i>
                  Este ID será utilizado para identificar su orden.
                </p>
              </div>
              
              <div class="form-group">
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1 items-center">
                  <i class="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                  Ubicación
                </label>
                <div class="relative">
                  <select id="location" class="w-full rounded-lg py-3 px-4 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option value="${
                      RentalLocation.WITHIN_CITY
                    }">Dentro de la ciudad</option>
                    <option value="${
                      RentalLocation.OUTSIDE_CITY
                    }">Fuera de la ciudad</option>
                    <option value="${
                      RentalLocation.IN_STORE
                    }">En el establecimiento</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <i class="fas fa-chevron-down text-gray-400"></i>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-500 flex items-center">
                  <i class="fas fa-tag mr-1 text-blue-400"></i>
                  La ubicación afecta al precio final del servicio.
                </p>
              </div>
              
              <div class="form-group">
                <label for="computer-count" class="block text-sm font-medium text-gray-700 mb-1 items-center">
                  <i class="fas fa-laptop text-blue-500 mr-2"></i>
                  Número de equipos
                </label>
                <div class="relative">
                  <input type="number" id="computer-count" min="2" value="2" aria-describedby="computer-count-help"
                    class="w-full rounded-lg py-3 px-4 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <div class="absolute inset-y-0 right-0 flex items-center px-3">
                    <span class="text-gray-500">uds.</span>
                  </div>
                </div>
                <p id="computer-count-help" class="mt-1 text-sm text-gray-500 flex items-center">
                  <i class="fas fa-exclamation-circle mr-1 text-amber-400"></i>
                  Mínimo 2 equipos por orden.
                </p>
              </div>
              
              <div class="form-group">
                <label for="initial-days" class="block text-sm font-medium text-gray-700 mb-1 items-center">
                  <i class="fas fa-calendar-day text-blue-500 mr-2"></i>
                  Días de alquiler inicial
                </label>
                <div class="relative">
                  <input type="number" id="initial-days" min="1" value="1" 
                    class="w-full rounded-lg py-3 px-4 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <div class="absolute inset-y-0 right-0 flex items-center px-3">
                    <span class="text-gray-500">días</span>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-500 flex items-center">
                  <i class="fas fa-info-circle mr-1 text-blue-400"></i>
                  Cantidad de días para el alquiler inicial.
                </p>
              </div>
              
              <div class="form-group md:col-span-2 lg:col-span-1">
                <label for="additional-days" class="block text-sm font-medium text-gray-700 mb-1 items-center">
                  <i class="fas fa-calendar-plus text-blue-500 mr-2"></i>
                  Días adicionales
                </label>
                <div class="relative">
                  <input type="number" id="additional-days" min="0" value="0" aria-describedby="additional-days-help"
                    class="w-full rounded-lg py-3 px-4 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <div class="absolute inset-y-0 right-0 flex items-center px-3">
                    <span class="text-gray-500">días</span>
                  </div>
                </div>
                <div class="mt-1 text-sm text-gray-500 flex items-center">
                  <i class="fas fa-percentage mr-1 text-green-500"></i>
                  <span>Días extra con descuento del 2% por día.</span>
                </div>
              </div>
            </div>
            
            <div id="form-error" class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 hidden rounded-md">
              <div class="flex">
                <i class="fas fa-exclamation-circle mr-2 text-red-500"></i>
                <span id="error-message"></span>
              </div>
            </div>
            
            <div class="pt-6 border-t border-gray-200">
              <button type="submit" id="submit-button"
                class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium shadow-md transition-all flex justify-center items-center">
                <i class="fas fa-calculator mr-2"></i>
                Calcular y Generar Factura
              </button>
            </div>
          </form>
        </div>
        
        <!-- Sección de Factura -->
        <div id="receipt" class="mt-8 bg-white rounded-xl shadow-xl p-6 md:p-8 hidden slide-up mb-8">
          <!-- Receipt content will be dynamically inserted here -->
        </div>
      </div>
    </main>
    
    <footer class="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fas fa-info-circle mr-2"></i> Sobre ALQUIPC
            </h3>
            <p class="text-gray-300 text-sm">
              Empresa dedicada al alquiler de equipos de cómputo a nivel nacional con más de 10 años de experiencia en el sector.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fas fa-phone-alt mr-2"></i> Contacto
            </h3>
            <p class="text-gray-300 text-sm mb-2">Línea gratuita: 01 8000 123 456</p>
            <p class="text-gray-300 text-sm">Email: contacto@alquipc.com</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fas fa-leaf mr-2"></i> Compromiso
            </h3>
            <p class="text-gray-300 text-sm">
              Comprometidos con el medio ambiente y la calidad de servicio según normas ISO/IEC 25010 y WCAG.
            </p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div class="flex flex-col">
            <p class="text-gray-400 text-sm">© ${new Date().getFullYear()} ALQUIPC - Todos los derechos reservados</p>
            <p class="text-gray-400 text-sm mt-1">Desarrollado por Cristian</p>
          </div>
          <div class="mt-4 md:mt-0 flex space-x-4">
            <a href="https://github.com/cris-sh/alquipc-billing" class="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github text-lg"></i><span class="sr-only">Repositorio GitHub</span>
            </a>
            <a href="https://www.enux.dev/projects/alquipc" class="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-newspaper text-lg"></i><span class="sr-only">Artículo sobre el proyecto</span>
            </a>
            <a href="https://www.enux.dev" class="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-globe text-lg"></i><span class="sr-only">Portafolio web</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
`;

// Función para mostrar errores de validación
function showError(message: string) {
  const errorElement = document.getElementById("form-error");
  const errorMessage = document.getElementById("error-message");
  if (errorElement && errorMessage) {
    errorMessage.textContent = message;
    errorElement.classList.remove("hidden");
    errorElement.classList.add("animate-shake");
    setTimeout(() => {
      errorElement.classList.remove("animate-shake");
    }, 500);

    errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Función para ocultar errores
function hideError() {
  const errorElement = document.getElementById("form-error");
  if (errorElement) {
    errorElement.classList.add("hidden");
  }
}

document.getElementById("theme-toggle")?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const themeIcon = document.querySelector("#theme-toggle i");
  if (themeIcon) {
    themeIcon.classList.toggle("fa-moon");
    themeIcon.classList.toggle("fa-sun");
  }
});

// Función para validar el formulario (ISO/IEC 25010 - Adecuación Funcional)
function validateForm(): boolean {
  const clientId = (document.getElementById("client-id") as HTMLInputElement)
    .value;
  const computerCount = parseInt(
    (document.getElementById("computer-count") as HTMLInputElement).value
  );
  const initialDays = parseInt(
    (document.getElementById("initial-days") as HTMLInputElement).value
  );
  const additionalDays = parseInt(
    (document.getElementById("additional-days") as HTMLInputElement).value
  );

  if (!clientId || clientId.trim() === "") {
    showError("Por favor, genere un ID de cliente primero.");
    return false;
  }

  if (isNaN(computerCount) || computerCount < 2) {
    showError("El número mínimo de equipos es 2.");
    return false;
  }

  if (isNaN(initialDays) || initialDays < 1) {
    showError("Debe alquilar al menos por 1 día.");
    return false;
  }

  if (isNaN(additionalDays) || additionalDays < 0) {
    showError("Los días adicionales no pueden ser negativos.");
    return false;
  }

  hideError();
  return true;
}

// Event handlers
document.getElementById("generate-id")?.addEventListener("click", async () => {
  const button = document.getElementById("generate-id") as HTMLButtonElement;
  const clientIdInput = document.getElementById(
    "client-id"
  ) as HTMLInputElement;

  // Disable button and show loading state
  button.disabled = true;
  button.textContent = "Generando...";

  try {
    const clientId = await ApiService.generateClientId();
    clientIdInput.value = clientId;
  } catch (error) {
    showError(
      "Error al generar el ID de cliente. Por favor, intente nuevamente."
    );
    console.error("Error generando ID de cliente:", error);
  } finally {
    button.disabled = false;
    button.textContent = "Generar";
  }
});

document
  .getElementById("rental-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitButton = document.getElementById(
      "submit-button"
    ) as HTMLButtonElement;
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i> Procesando...';

    try {
      const clientId = (
        document.getElementById("client-id") as HTMLInputElement
      ).value;
      const location = (
        document.getElementById("location") as HTMLSelectElement
      ).value as RentalLocation;
      const computerCount = parseInt(
        (document.getElementById("computer-count") as HTMLInputElement).value
      );
      const initialDays = parseInt(
        (document.getElementById("initial-days") as HTMLInputElement).value
      );
      const additionalDays = parseInt(
        (document.getElementById("additional-days") as HTMLInputElement).value
      );

      const order = {
        clientId,
        location,
        computerCount,
        initialDays,
        additionalDays,
      };
      const priceSummary = PriceCalculator.calculatePrice(order);

      const formatter = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });

      let locationText = "";
      let locationIcon = "";

      switch (location) {
        case RentalLocation.WITHIN_CITY:
          locationText = "Dentro de la ciudad";
          locationIcon = "fa-city";
          break;
        case RentalLocation.OUTSIDE_CITY:
          locationText = "Fuera de la ciudad";
          locationIcon = "fa-truck";
          break;
        case RentalLocation.IN_STORE:
          locationText = "En el establecimiento";
          locationIcon = "fa-store";
          break;
      }

      // Display receipt
      const receiptElement = document.getElementById(
        "receipt"
      ) as HTMLDivElement;
      receiptElement.classList.remove("hidden");

      // Calculate values for the receipt
      const initialCost = computerCount * initialDays * 35000;
      const additionalCost = computerCount * additionalDays * 35000;
      const adjustedInitialCost = initialCost + priceSummary.locationAdjustment;
      const adjustedAdditionalCost =
        additionalCost + priceSummary.additionalDaysDiscount;

      receiptElement.scrollIntoView({ behavior: "smooth", block: "start" });

      receiptElement.innerHTML = `
      <div class="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
        <div>
          <h2 class="text-3xl font-bold text-gray-800 flex items-center">
            <i class="fas fa-file-invoice text-green-600 mr-3"></i>
            Factura Digital
          </h2>
          <p class="text-gray-500">Fecha: ${new Date().toLocaleDateString(
            "es-CO"
          )}</p>
        </div>
        <div class="bg-blue-50 text-blue-700 py-2 px-4 rounded-lg border border-blue-200 flex items-center">
          <i class="fas fa-id-card mr-2"></i>
          <div>
            <div class="text-xs uppercase text-blue-600">ID Cliente</div>
            <div class="font-medium">${clientId}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg receipt-section">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <i class="fas ${locationIcon} text-blue-500 mr-2"></i>
            Detalles de la Orden
          </h3>
          <ul class="space-y-3">
            <li class="flex justify-between">
              <span class="text-gray-600">Ubicación:</span>
              <span class="font-medium">${locationText}</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Equipos:</span>
              <span class="font-medium">${computerCount} unidades</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Días iniciales:</span>
              <span class="font-medium">${initialDays} días</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Días adicionales:</span>
              <span class="font-medium">${additionalDays} días</span>
            </li>
          </ul>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg receipt-section">
          <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <i class="fas fa-receipt text-green-500 mr-2"></i>
            Resumen de Costos
          </h3>
          <ul class="space-y-3">
            <li class="flex justify-between">
              <span class="text-gray-600">Precio por día:</span>
              <span class="font-medium">${formatter.format(35000)}</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Días facturados:</span>
              <span class="font-medium">${initialDays} días</span>
            </li>
            <li class="flex justify-between">
              <span class="text-gray-600">Total equipos × días:</span>
              <span class="font-medium">${formatter.format(initialCost)}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Desglose detallado de costos -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 class="font-semibold text-gray-800">Desglose Detallado</h3>
        </div>
        
        <div class="p-4 space-y-3">
          <!-- Costos iniciales -->
          <div class="pb-3">
            <div class="flex justify-between font-medium text-gray-900">
              <span>Costo días iniciales (${initialDays} días)</span>
              <span>${formatter.format(initialCost)}</span>
            </div>
            <div class="text-sm text-gray-600">
              <span>${computerCount} equipos × ${initialDays} días × ${formatter.format(
        35000
      )}</span>
            </div>
          </div>
          
          <!-- Ajustes por ubicación -->
          ${
            priceSummary.locationAdjustment !== 0
              ? `
          <div class="pb-3 border-t border-gray-100 pt-3">
            <div class="flex justify-between">
              <span class="font-medium text-${
                priceSummary.locationAdjustment > 0 ? "red" : "green"
              }-600">
                ${
                  priceSummary.locationAdjustment > 0
                    ? "Incremento"
                    : "Descuento"
                } por ubicación
              </span>
              <span class="font-medium text-${
                priceSummary.locationAdjustment > 0 ? "red" : "green"
              }-600">
                ${
                  priceSummary.locationAdjustment > 0 ? "+" : ""
                }${formatter.format(priceSummary.locationAdjustment)}
              </span>
            </div>
            <div class="text-sm text-gray-600">
              <span>${formatter.format(initialCost)} × ${Math.abs(
                  (priceSummary.locationAdjustment / initialCost) * 100
                )}%</span>
            </div>
          </div>
          `
              : ""
          }
          
          <!-- Subtotal después de ajustes de ubicación -->
          <div class="pb-3 border-t border-gray-100 pt-3">
            <div class="flex justify-between font-medium">
              <span>Costo inicial ajustado</span>
              <span>${formatter.format(adjustedInitialCost)}</span>
            </div>
          </div>
          
          <!-- Días adicionales si aplica -->
          ${
            additionalDays > 0
              ? `
          <div class="border-t border-gray-200 pt-3 mt-3">
            <div class="flex justify-between font-medium text-gray-900">
              <span>Costo días adicionales (${additionalDays} días)</span>
              <span>${formatter.format(additionalCost)}</span>
            </div>
            <div class="text-sm text-gray-600 mb-2">
              <span>${computerCount} equipos × ${additionalDays} días × ${formatter.format(
                  35000
                )}</span>
            </div>
            
            <!-- Descuento por días adicionales -->
            <div class="flex justify-between">
              <span class="font-medium text-green-600">Descuento por días adicionales</span>
              <span class="font-medium text-green-600">${formatter.format(
                priceSummary.additionalDaysDiscount
              )}</span>
            </div>
            <div class="text-sm text-gray-600 mb-2">
              <span>${formatter.format(additionalCost)} × 2%</span>
            </div>
            
            <!-- Subtotal después de descuentos -->
            <div class="flex justify-between font-medium mt-2">
              <span>Costo adicional ajustado</span>
              <span>${formatter.format(adjustedAdditionalCost)}</span>
            </div>
          </div>
          `
              : ""
          }
        </div>
      </div>
      
      <!-- Total final con estilo destacado -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 flex justify-between items-center mb-6">
        <div>
          <div class="text-lg text-green-800 font-medium">Total a Pagar</div>
          <div class="text-sm text-green-600">IVA incluido</div>
        </div>
        <div class="text-3xl font-bold text-green-700">
          ${formatter.format(priceSummary.totalPrice)}
        </div>
      </div>
      
      <!-- Mensaje de factura electrónica -->
      <div id="email-information" class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
        <div class="flex items-start">
          <i class="fas fa-info-circle mt-0.5 mr-3"></i>
          <div>
            <h4 class="font-semibold">Información Importante</h4>
            <p class="text-sm mt-1">Esta factura será enviada por correo electrónico. ALQUIPC agradece su compromiso con el medio ambiente al no imprimir este recibo.</p>
          </div>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div id="action-buttons" class="flex flex-col sm:flex-row gap-4 mt-6">
        <button id="new-order" class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium shadow-md transition-colors flex-1 flex justify-center items-center">
          <i class="fas fa-plus-circle mr-2"></i> Nueva Orden
        </button>
        <button id="download-pdf" class="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium shadow-md transition-colors flex justify-center items-center">
          <i class="fas fa-file-pdf mr-2"></i> Descargar PDF
        </button>
        <button id="send-email" class="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium shadow-md transition-colors flex justify-center items-center">
          <i class="fas fa-envelope mr-2"></i> Enviar por Email
        </button>
      </div>
    `;

      document.getElementById("new-order")?.addEventListener("click", () => {
        receiptElement.classList.add("hidden");
        (document.getElementById("rental-form") as HTMLFormElement).reset();
        (document.getElementById("client-id") as HTMLInputElement).value = "";
      });

      /**
       * INICIO DE DESCARGA DE PDF
       *
       * Este, actualmente es funcional. Pero extrae directamente los valores y crea el PDF manual, por asi decirlo.
       * La idea, aunque no obligatorio, seria que se pudiera extraer el HTML completo y crear el PDF a partir de eso.
       *
       * Libreria apta para eso (sugerida): html2canvas-pro
       *
       */
      document
        .getElementById("download-pdf")
        ?.addEventListener("click", async function () {
            const loadingModal = document.createElement("div");
            loadingModal.className =
              "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
            loadingModal.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl">
              <div class="flex items-center">
                <i class="fas fa-spinner fa-spin mr-3 text-blue-500 text-xl"></i>
                <p>Generando PDF, por favor espere...</p>
              </div>
            </div>
          `;
            document.body.appendChild(loadingModal);

          try {
            if (!receiptElement) {
              throw new Error("Elemento de recibo no encontrado.");
            }

            // Ocultar los botones de acción
            receiptElement.classList.remove("slide-up");

            const actionButtons = document.getElementById("action-buttons");
            const originalDisplay = actionButtons
              ? (actionButtons as HTMLElement).style.display
              : null;
            if (actionButtons) {
              (actionButtons as HTMLElement).style.display = "none";
            }

            const canvas = await html2canvas(receiptElement, {
              width: receiptElement.scrollWidth,
              height: receiptElement.scrollHeight,
              windowWidth: document.documentElement.scrollWidth,
              windowHeight: document.documentElement.scrollHeight,

              backgroundColor: "#fff",
              useCORS: true,
              allowTaint: true,

              scale: 2,
              logging: false,

              onclone: (clonedDoc) => {
                console.log(clonedDoc);
                clonedDoc.body.style.boxShadow = "none";
              },
            });

            receiptElement.classList.add("slide-up");
            if (actionButtons && originalDisplay !== null) {
              (actionButtons as HTMLElement).style.display = originalDisplay;
            }

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
              unit: "px",
              format: [canvas.width, canvas.height],
              compress: true,
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

            const fileName = `FACTURA-${clientId}-${new Date().toLocaleDateString(
              "es-CO"
            )}.pdf`;
            pdf.save(fileName);
          } catch (error) {
            console.error("Error generando PDF:", error);
            showError(
              "Error al generar el PDF. Por favor, intente nuevamente."
            );
          } finally {
            loadingModal.remove();
          }
        });

      /**
       * FIN DE DESCARGA DE PDF
       */

      document.getElementById("send-email")?.addEventListener("click", () => {
        const emailModal = document.createElement("div");
        emailModal.className =
          "fixed inset-0 bg-black/50 flex items-center justify-center z-50 fade-in";
        emailModal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md w-full shadow-xl slide-up">
          <h3 class="text-xl font-semibold mb-4 flex items-center">
            <i class="fas fa-envelope text-green-600 mr-2"></i>
            Enviar Factura por Email
          </h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input type="email" placeholder="cliente@ejemplo.com" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          </div>
          <div class="flex justify-end space-x-2">
            <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md" id="cancel-email">Cancelar</button>
            <button class="px-4 py-2 bg-green-600 text-white rounded-md" id="confirm-email">Enviar</button>
          </div>
        </div>
      `;

        document.body.appendChild(emailModal);

        document
          .getElementById("cancel-email")
          ?.addEventListener("click", () => {
            emailModal.remove();
          });

        document
          .getElementById("confirm-email")
          ?.addEventListener("click", () => {
            emailModal.innerHTML = `
          <div class="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <div class="text-center">
              <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
              <h3 class="text-xl font-semibold mb-2">¡Factura Enviada!</h3>
              <p class="text-gray-600 mb-4">La factura ha sido enviada al correo electrónico proporcionado.</p>
              <button class="px-4 py-2 bg-blue-600 text-white rounded-md" id="close-modal">Cerrar</button>
            </div>
          </div>
        `;

            document
              .getElementById("close-modal")
              ?.addEventListener("click", () => {
                emailModal.remove();
              });
          });
      });

      // Enviar orden a API
      await ApiService.submitOrder(order);
    } catch (error) {
      showError("Error al procesar la orden. Por favor, intente nuevamente.");
      console.error("Error procesando orden:", error);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML =
        '<i class="fas fa-calculator mr-2"></i> Calcular y Generar Factura';
    }
  });
