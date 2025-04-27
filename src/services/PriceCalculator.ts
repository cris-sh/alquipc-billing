import { PriceSummary, RentalLocation, RentalOrder } from "../models/Rental";

/**
 * Service to calculate the price of a rental order.
 * Implemented following the ISO/IEC 25010 standard for software quality.
 */
export class PriceCalculator {
  private static readonly PRICE_PER_DAY = 35000;
  private static readonly OUTSIDE_CITY_SURCHARGE = 0.05; // 5% increase
  private static readonly IN_STORE_DISCOUNT = 0.05; // 5% discount
  private static readonly ADDITIONAL_DAY_DISCOUNT = 0.02; // 2% discount for each additional day

  /**
   * Calculate the rental price based on the order details.
   * @param order Order data to calculate the price for
   * @returns Rental price summary
   */
  public static calculatePrice(order: RentalOrder): PriceSummary {
    if (!this.validateOrder(order)) {
      throw new Error("Orden de alquiler invalida.");
    }

    // 1. Calculate base price for the initial days
    const initialDaysTotal =
      order.computerCount * order.initialDays * this.PRICE_PER_DAY;

    // 2. Calculate the adjustment (only applies to the initial days)
    let locationAdjustment = 0;
    if (order.location === RentalLocation.OUTSIDE_CITY) {
      locationAdjustment = initialDaysTotal * this.OUTSIDE_CITY_SURCHARGE;
    } else if (order.location === RentalLocation.IN_STORE) {
      locationAdjustment = -initialDaysTotal * this.IN_STORE_DISCOUNT;
    }

    // 3. Initial cost with location adjustment
    const adjustedInitialCost = initialDaysTotal + locationAdjustment;

    // 4. Calculate the cost for additional days
    const additionalDaysTotal =
      order.computerCount * order.additionalDays * this.PRICE_PER_DAY;

    // 5. Discount for additional days (only applies to the additional days)
    const additionalDaysDiscount =
      order.additionalDays > 0
        ? additionalDaysTotal * this.ADDITIONAL_DAY_DISCOUNT
        : 0;

    // 6. Cost for additional days with discount applied
    const adjustedAdditionalCost = additionalDaysTotal - additionalDaysDiscount;

    // 7. Total cost (initial adjusted + additional with discount)
    const totalPrice = adjustedInitialCost + adjustedAdditionalCost;

    // For interface purposes, we return the base price and the adjustments separately
    const basePrice = initialDaysTotal + additionalDaysTotal; // Base price without adjustments or discounts

    return {
      basePrice,
      locationAdjustment,
      additionalDaysDiscount: -additionalDaysDiscount, // Negative because it's a discount
      totalPrice,
    };
  }

  /**
   * Validates the rental order.
   * @param order Order data to validate
   * @returns True if the order is valid, false otherwise
   */
  public static validateOrder(order: RentalOrder): boolean {
    if (!order) return false;
    if (!order.clientId || order.clientId.trim() === "") return false;
    if (order.computerCount < 2) return false;
    if (order.initialDays < 1) return false;
    if (order.additionalDays < 0) return false;

    return true;
  }
}
