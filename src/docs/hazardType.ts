/**
 * @openapi
 * components:
 *   schemas:
 *     HazardType:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 3 }
 *         name_en: { type: string, example: Electrical }
 *         name_mn: { type: string, example: Цахилгаан }
 *         last_code: { type: integer, example: 57 }
 *     HazardTypeCreateRequest:
 *       type: object
 *       required: [name_en, name_mn]
 *       properties:
 *         name_en: { type: string }
 *         name_mn: { type: string }
 *         last_code: { type: integer }
 *     HazardTypeUpdateRequest:
 *       type: object
 *       properties:
 *         name_en: { type: string }
 *         name_mn: { type: string }
 *         last_code: { type: integer }
 */

/**
 * @openapi
 * /api/hazardType:
 *   get:
 *     summary: List hazard types
 *     tags: [HazardType]
 *     responses:
 *       200:
 *         description: A list of hazard types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/HazardType' }
 *   post:
 *     summary: Create a hazard type
 *     tags: [HazardType]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HazardTypeCreateRequest' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HazardType' }
 */

/**
 * @openapi
 * /api/hazardType/{id}:
 *   get:
 *     summary: Get a hazard type by ID
 *     tags: [HazardType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Hazard type
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HazardType' }
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a hazard type
 *     tags: [HazardType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HazardTypeUpdateRequest' }
 *     responses:
 *       200:
 *         description: Updated hazard type
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HazardType' }
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a hazard type
 *     tags: [HazardType]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: hazard type deleted successfully
 *       404:
 *         description: Not found
 */
