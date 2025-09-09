/**
 * @openapi
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 10 }
 *         name_en: { type: string, example: Gate A3 }
 *         name_mn: { type: string, example: А3 хаалга }
 *         location_group_id: { type: integer, example: 1 }
 *     LocationCreateRequest:
 *       type: object
 *       required: [name_en, name_mn, location_group_id]
 *       properties:
 *         name_en: { type: string }
 *         name_mn: { type: string }
 *         location_group_id: { type: integer }
 *     LocationUpdateRequest:
 *       type: object
 *       properties:
 *         name_en: { type: string }
 *         name_mn: { type: string }
 *         location_group_id: { type: integer }
 */

/**
 * @openapi
 * /api/locations:
 *   get:
 *     summary: List locations
 *     tags: [Location]
 *     responses:
 *       200:
 *         description: A list of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Location' }
 *   post:
 *     summary: Create a location
 *     tags: [Location]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LocationCreateRequest' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Location' }
 */

/**
 * @openapi
 * /api/locations/{id}:
 *   get:
 *     summary: Get a location by ID
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Location
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Location' }
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a location
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LocationUpdateRequest' }
 *     responses:
 *       200:
 *         description: Updated location
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Location' }
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a location
 *     tags: [Location]
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
 *               example: Location deleted successfully
 *       404:
 *         description: Not found
 * */
