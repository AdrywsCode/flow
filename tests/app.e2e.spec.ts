import { test, expect } from "@playwright/test";

test("login, cria projeto, cria tarefa e move status", async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error("Defina E2E_EMAIL e E2E_PASSWORD no ambiente.");
  }

  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/app/);

  await page.getByTestId("new-project-button").click();
  await page.getByLabel("Nome do projeto").fill("Projeto E2E");
  await page.getByRole("button", { name: "Salvar" }).click();

  await page.getByTestId("new-task-button").click();
  await page.getByLabel("Titulo").fill("Tarefa E2E");
  await page.getByLabel("Projeto").click();
  await page.getByRole("option", { name: "Projeto E2E" }).click();
  await page.getByRole("button", { name: "Salvar" }).click();

  await page.getByRole("button", { name: "Mover para Doing" }).first().click();
  await expect(page.getByText("doing", { exact: false })).toBeVisible();
});
