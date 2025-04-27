import { RentalLocation } from "../src/models/Rental";
import { PriceCalculator } from "../src/services/PriceCalculator";
import { ApiService } from "../src/services/MockAPI";

describe("PriceCalculator - Test Cases", () => {
  test("Escenario 1: Dentro de la ciudad sin dias adicionales", async () => {
    const generatedUserId = await ApiService.generateClientId();
    const order = {
      clientId: generatedUserId,
      computerCount: 3,
      initialDays: 5,
      additionalDays: 0,
      location: RentalLocation.WITHIN_CITY,
    };

    const result = PriceCalculator.calculatePrice(order);

    expect(order.clientId).not.toBeNull(); // Verifica que el ID del cliente no sea nulo
    expect(result.basePrice).toBe(525000); // 3 * 35000 * 5
    expect(result.locationAdjustment).toBe(0);
    expect(result.additionalDaysDiscount).toBe(-0);
    expect(result.totalPrice).toBe(525000);
  });

  test("Escenario 2: Fuera de al ciudad con dias adicionales", async () => {
    const generatedUserId = await ApiService.generateClientId();
    const order = {
      clientId: generatedUserId,
      computerCount: 4,
      initialDays: 7,
      additionalDays: 2,
      location: RentalLocation.OUTSIDE_CITY,
    };

    const result = PriceCalculator.calculatePrice(order);

    // Cálculos según el caso de prueba
    const initialCost = 4 * 35000 * 7; // 980000
    const locationSurcharge = initialCost * 0.05; // 49000
    const adjustedInitialCost = initialCost + locationSurcharge; // 1029000

    const additionalCost = 4 * 35000 * 2; // 280000
    const additionalDiscount = additionalCost * 0.02; // 5600
    const adjustedAdditionalCost = additionalCost - additionalDiscount; // 274400

    const expectedTotal = adjustedInitialCost + adjustedAdditionalCost; // 1303400

    expect(order.clientId).not.toBeNull(); // Verifica que el ID del cliente no sea nulo
    expect(result.basePrice).toBe(initialCost + additionalCost); // 1260000
    expect(result.locationAdjustment).toBe(locationSurcharge); // 49000
    expect(result.additionalDaysDiscount).toBe(-additionalDiscount); // -5600
    expect(result.totalPrice).toBe(expectedTotal); // 1303400
  });

  // Escenario 3: Alquiler de equipos dentro del establecimiento
  test("Escenario 3: Dentro del establecimiento sin días adicionales", async () => {
    const generatedUserId = await ApiService.generateClientId();
    const order = {
      clientId: generatedUserId,
      computerCount: 2,
      initialDays: 4,
      additionalDays: 0,
      location: RentalLocation.IN_STORE,
    };

    const result = PriceCalculator.calculatePrice(order);

    // Cálculos según el caso de prueba
    const initialCost = 2 * 35000 * 4; // 280000
    const locationDiscount = initialCost * 0.05; // 14000
    const expectedTotal = initialCost - locationDiscount; // 266000

    expect(order.clientId).not.toBeNull(); // Verifica que el ID del cliente no sea nulo
    expect(result.basePrice).toBe(initialCost); // 280000
    expect(result.locationAdjustment).toBe(-locationDiscount); // -14000
    expect(result.additionalDaysDiscount).toBe(-0); // -0
    expect(result.totalPrice).toBe(expectedTotal); // 266000
  });

  // Escenario 4: Alquiler de equipos fuera de la ciudad con días adicionales múltiples
  test("Escenario 4: Fuera de la ciudad con múltiples días adicionales", async () => {
    const generatedUserId = await ApiService.generateClientId();
    const order = {
      clientId: generatedUserId,
      computerCount: 5,
      initialDays: 3,
      additionalDays: 4,
      location: RentalLocation.OUTSIDE_CITY,
    };

    const result = PriceCalculator.calculatePrice(order);

    // Cálculos según el caso de prueba
    const initialCost = 5 * 35000 * 3; // 525000
    const locationSurcharge = initialCost * 0.05; // 26250
    const adjustedInitialCost = initialCost + locationSurcharge; // 551250

    const additionalCost = 5 * 35000 * 4; // 700000
    const additionalDiscount = additionalCost * 0.02; // 14000
    const adjustedAdditionalCost = additionalCost - additionalDiscount; // 686000

    const expectedTotal = adjustedInitialCost + adjustedAdditionalCost; // 1237250

    expect(order.clientId).not.toBeNull(); // Verifica que el ID del cliente no sea nulo
    expect(result.basePrice).toBe(initialCost + additionalCost); // 1225000
    expect(result.locationAdjustment).toBe(locationSurcharge); // 26250
    expect(result.additionalDaysDiscount).toBe(-additionalDiscount); // -14000
    expect(result.totalPrice).toBe(expectedTotal); // 1237250
  });

  // Escenario 5: Validación de error - Solicitud de menos de 2 equipos
  test("Escenario 5: Error al solicitar menos de 2 equipos", async () => {
    const generatedUserId = await ApiService.generateClientId();
    const order = {
      clientId: generatedUserId,
      computerCount: 1, // Menos del mínimo
      initialDays: 3,
      additionalDays: 0,
      location: RentalLocation.WITHIN_CITY,
    };

    expect(order.clientId).not.toBeNull(); // Verifica que el ID del cliente no sea nulo
    expect(() => {
      PriceCalculator.calculatePrice(order);
    }).toThrow("Orden de alquiler invalida.");
  });
});
