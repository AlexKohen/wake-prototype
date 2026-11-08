import { test, expect, type Page } from '@playwright/test';
const date = '2099-07-19';
async function role(page: Page, owner = false) {
  await page.getByRole('button', { name: 'Роль и настройки' }).click();
  await page
    .getByRole('button', {
      name: owner ? 'Я владелец катера / школы' : 'Хочу покататься',
      exact: false,
    })
    .click();
}
async function search(page: Page, location = 'Строгино') {
  await page.getByLabel('Где катаемся?').fill(location);
  await page.getByLabel('Дата катания').fill(date);
  await page.getByLabel('Время катания').fill('15:00');
  await page.getByRole('button', { name: 'Найти катер', exact: true }).click();
}
test('customer booking, cross-sport overlap, persistence, owner calendar and cancellation', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await search(page);
  await expect(page.locator('.boat-card')).toHaveCount(2);
  await page.locator('.boat-card').first().getByRole('button', { name: 'Забронировать' }).click();
  await expect(page.getByRole('dialog')).toContainText('15:00–15:30');
  await expect(page.getByRole('dialog').locator('input[type=time]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Подтвердить бронирование' }).click();
  await expect(page.getByRole('dialog')).toContainText('Катер забронирован!');
  await page.getByRole('button', { name: 'Мои бронирования', exact: true }).click();
  await expect(page.locator('.reservation-card')).toHaveCount(1);
  await role(page, true);
  await page.getByRole('button', { name: 'Расписание', exact: false }).first().click();
  await page.getByLabel('Дата расписания').fill(date);
  await expect(page.locator('.booked-slot').first()).toContainText('15:00');
  await role(page);
  await search(page);
  await expect(page.locator('.boat-card')).toHaveCount(1);
  await page.getByLabel('Спорт', { exact: true }).selectOption('Вейкборд');
  await page.getByRole('button', { name: 'Найти катер', exact: true }).click();
  await expect(page.locator('.boat-card')).toHaveCount(1);
  await page.reload();
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await page.locator('.bottom-nav').getByRole('button', { name: 'Брони', exact: true }).click();
  await expect(page.locator('.reservation-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Отменить бронь' }).click();
  await page.getByRole('button', { name: 'Да, отменить' }).click();
  await expect(page.locator('.status.cancelled')).toContainText('Отменено');
  await page.locator('.bottom-nav').getByRole('button', { name: 'Поиск', exact: true }).click();
  await search(page);
  await expect(page.locator('.boat-card')).toHaveCount(2);
  await expect(page.locator('body')).not.toHaveJSProperty('scrollWidth', 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});
test('favorites persist and listing opens, map marker supports direct booking', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await page.getByRole('button', { name: 'В избранное Своя волна', exact: true }).click();
  await page.locator('.bottom-nav').getByRole('button', { name: 'Избранное' }).click();
  await expect(page.locator('.boat-card')).toHaveCount(1);
  await page.reload();
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await page.locator('.bottom-nav').getByRole('button', { name: 'Избранное' }).click();
  await page.getByRole('button', { name: 'Своя волна', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Malibu 23 LSV');
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
  await page.locator('.bottom-nav').getByRole('button', { name: 'Поиск', exact: true }).click();
  await search(page);
  await page.locator('.bottom-nav').getByRole('button', { name: 'Карта', exact: true }).click();
  await expect(page.locator('.price-marker')).toHaveCount(2);
  await page.locator('.price-marker').first().click();
  await expect(page.getByRole('dialog')).toContainText('15:00–15:30');
  await expect(page.getByRole('button', { name: 'Подтвердить бронирование' })).toBeVisible();
});
test('owner voice text, multiple tariffs, publish, calendar block and connected customer journey', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Я владелец катера / школы', exact: true }).click();
  await page.getByRole('button', { name: 'Добавить катер', exact: false }).click();
  await page
    .getByLabel('Запрос голосом или текстом')
    .fill(
      'Добавь катер Malibu 23 LSV 2020 года. Вейксерф и вейкборд. Сет 25 минут стоит 7000 рублей. Работаем с 9 утра до 9 вечера',
    );
  await page.getByRole('button', { name: 'Разобрать запрос' }).click();
  await expect(page.getByLabel('Название катера', { exact: true })).toHaveValue('Malibu 23 LSV');
  await page.getByLabel('Школа / оператор').fill('Тестовая волна');
  await page.getByRole('button', { name: 'Проверить и опубликовать' }).click();
  await expect(page.getByRole('heading', { name: 'Всё верно?' })).toBeVisible();
  await page.getByRole('button', { name: 'Да, добавить катер' }).click();
  await expect(page.getByRole('heading', { name: 'Расписание.' })).toBeVisible();
  await page.getByLabel('Дата расписания').fill(date);
  await page.getByRole('button', { name: 'Закрыть день / добавить перерыв' }).click();
  await page.getByLabel('Закрыть весь день').check();
  await page.getByRole('button', { name: 'Сохранить перерыв' }).click();
  await expect(page.locator('.blocked-slot').first()).toContainText('Выходной');
  await page.getByRole('button', { name: 'Удалить перерыв' }).click();
  await role(page);
  await page.getByLabel('Длительность', { exact: true }).selectOption('25');
  await search(page, 'Тестовая волна');
  await expect(page.locator('.boat-card')).toHaveCount(1);
  await expect(page.locator('.boat-card')).toContainText('7 000');
  await page.getByRole('button', { name: 'Забронировать', exact: true }).click();
  await page.getByRole('button', { name: 'Подтвердить бронирование' }).click();
  await page.getByRole('button', { name: 'Мои бронирования', exact: true }).click();
  await role(page, true);
  await page
    .locator('.bottom-nav')
    .getByRole('button', { name: 'Бронирования', exact: true })
    .click();
  await expect(page.locator('.reservation-card')).toContainText('Тестовая волна');
});
test('customer text interpretation is editable before confirmed search; unknown input is honest', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await page.getByLabel('Запрос голосом или текстом').fill('бла бла');
  await page.getByRole('button', { name: 'Разобрать запрос' }).click();
  await expect(page.locator('.error[role=alert]')).toContainText('Не удалось понять');
  await page
    .getByLabel('Запрос голосом или текстом')
    .fill('Вейксерф в Строгино завтра в 15:00 на полчаса');
  await page.getByRole('button', { name: 'Разобрать запрос' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByLabel('Где', { exact: true })).toHaveValue('Строгино');
  await page.getByRole('dialog').getByLabel('Где', { exact: true }).fill('Крылатское');
  await page.getByRole('button', { name: 'Всё верно, найти катер' }).click();
  await expect(page.locator('.boat-card')).toHaveCount(1);
  await expect(page.locator('.boat-card')).toContainText('Сет на закате');
});
test('desktop and mobile layouts have no horizontal overflow or missing local images', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Твоя волна. В любое время.' })).toBeVisible();
  await page.screenshot({ path: 'test-results/desktop-landing.png', fullPage: true });
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await expect(page.locator('.boat-card')).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/desktop-search.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-search.png', fullPage: true });
  const missing = await page
    .locator('img')
    .evaluateAll((images) =>
      (images as HTMLImageElement[])
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.src),
    );
  expect(missing).toEqual([]);
});

test('external school has an honest standalone demo page and no live booking claim', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await page.getByRole('button', { name: 'Волна рядом', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Её доступность нам неизвестна');
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Забронировать' })).toHaveCount(
    0,
  );
  const link = page.getByRole('link', { name: 'Перейти на сайт' });
  expect(await link.getAttribute('href')).toBe('/schools/demo-9');
  await page.goto('/schools/demo-9');
  await expect(page.getByRole('heading', { name: 'Волна рядом' })).toBeVisible();
  await expect(page.getByText('Вымышленная школа · отдельная демо-страница')).toBeVisible();
  await page.getByRole('link', { name: 'Вернуться в WAKE' }).click();
  await expect(page.getByRole('button', { name: 'Хочу покататься', exact: true })).toBeVisible();
});
test('PWA installs its worker and supports an offline customer shell after first visit', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const cache = await caches.open('wake-shell-v1');
        return (await cache.keys()).filter((r) => r.url.includes('/_next/static/')).length;
      }),
    )
    .toBeGreaterThan(2);
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await page.getByRole('button', { name: 'В избранное Своя волна', exact: true }).click();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await page.locator('.bottom-nav').getByRole('button', { name: 'Избранное', exact: true }).click();
  await expect(page.locator('.boat-card')).toHaveCount(1);
  await context.setOffline(false);
});
test('demo reset clears user data and unsupported speech offers a text fallback', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'SpeechRecognition', { value: undefined });
    Object.defineProperty(window, 'webkitSpeechRecognition', { value: undefined });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Хочу покататься', exact: true }).click();
  await page.getByRole('button', { name: 'Включить микрофон' }).click();
  await expect(page.locator('.voice-message')).toContainText('голосовой ввод недоступен');
  await page.getByRole('button', { name: 'В избранное Своя волна', exact: true }).click();
  await page.getByRole('button', { name: 'Роль и настройки' }).click();
  await page.getByRole('button', { name: 'Сбросить демо', exact: true }).click();
  await page.getByRole('button', { name: 'Сбросить демо', exact: true }).click();
  await page.locator('.bottom-nav').getByRole('button', { name: 'Избранное', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Здесь будет твоя коллекция волн' }),
  ).toBeVisible();
});
