import { Expect, expect } from "@playwright/test"

export class LoginPage {
    constructor(page) {
        this.page = page

        this.moveToSignupButton = page.getByRole('button', { name: 'Register' })
    }

    moveToSignup = async () => {
        await this.moveToSignupButton.waitFor()
        await this.moveToSignupButton.click()
        await this.page.waitForURL(/\/signup/, {timeout: 3000})
    }
}