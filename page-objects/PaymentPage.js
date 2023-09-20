import { expect } from "@playwright/test"

export class PaymentPage {
    constructor(page) {
        this.page = page

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]')

        this.discountCodeInput = page.locator('[data-qa="discount-code-input"]')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.activateDiscountMessage = page.locator('[data-qa="discount-active-message"]')
        this.totalPriceTag = page.locator('[data-qa="total-value"]')
        this.discountedPriceTag = page.locator('[data-qa="total-with-discount-value"]')

        this.cardOwnerInput = page.locator('[data-qa="credit-card-owner"]')
        this.cardNumberInput = page.locator('[data-qa="credit-card-number"]')
        this.validUntilInput = page.locator('[data-qa="valid-until"]')
        this.CVCInput = page.locator('[data-qa="credit-card-cvc"]')
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountCodeInput.waitFor()

        // Option 1 for laggy input
        await this.discountCodeInput.fill(code)
        await expect(this.discountCodeInput).toHaveValue(code)

        // Option 2 for laggy input
        // await this.discountCodeInput.focus()
        // await this.page.keyboard.type(code, {delay: 1000})

        expect(await this.discountedPriceTag.isVisible()).toBe(false)
        expect(await this.activateDiscountMessage.isVisible()).toBe(false)
        await this.activateDiscountButton.waitFor()
        await this.activateDiscountButton.click()

        await this.activateDiscountMessage.waitFor()

        await this.totalPriceTag.waitFor()
        const totalPriceText = await this.totalPriceTag.innerText()
        const totalPriceTextWithoutDollar = totalPriceText.replace("$", "")
        const totalPrice = parseInt(totalPriceTextWithoutDollar, 10)

        await this.discountedPriceTag.waitFor()
        const discountedPriceText = await this.discountedPriceTag.innerText()
        const discountedPriceWithoutDollar = discountedPriceText.replace("$", "")
        const discountedPrice = parseInt(discountedPriceWithoutDollar, 10)

        expect(discountedPrice).toBeLessThan(totalPrice)
    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.cardOwnerInput.waitFor()
        await this.cardOwnerInput.fill(paymentDetails.cardOwner)

        await this.cardNumberInput.waitFor()
        await this.cardNumberInput.fill(paymentDetails.cardNumber)

        await this.validUntilInput.waitFor()
        await this.validUntilInput.fill(paymentDetails.validUntil)

        await this.CVCInput.waitFor()
        await this.CVCInput.fill(paymentDetails.CVC)
    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, {timeout: 3000})
    }
}