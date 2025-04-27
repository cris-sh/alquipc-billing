import { RentalOrder } from "../models/Rental";
import { PriceCalculator } from "./PriceCalculator";

/**
 * Service to simulate API calls.
 * Implented following the ISO/IEC 25010 - Fiability
 */
export class ApiService {
  /**
   * Generates a random client ID.
   * @returns A promise that resolves to a random client ID.
   */
  public static async generateClientId(): Promise<string> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Generate a random client ID
      return `${Math.floor(100000 + Math.random() * 900000)}`;
    } catch (error) {
      console.error("Error generating client ID:", error);
      throw new Error(
        "No se pudo generar el ID del cliente. Por favor, inténtelo nuevamente."
      );
    }
  }

  /**
   * Send a rental order to the server.
   * @param order Order to be submitted
   * @returns Promise that resolves to true if the order was submitted successfully, false otherwise.
   */
  public static async submitOrder(order: RentalOrder): Promise<boolean> {
    try {
      if (!PriceCalculator.validateOrder(order)) {
        throw new Error("Datos de orden inválidos");
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return true;
    } catch (error) {
      console.error("Error al enviar la orden:", error);
      throw new Error(
        "No se pudo procesar la orden. Por favor, inténtelo nuevamente."
      );
    }
  }
}
