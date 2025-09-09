/**
 * @openapi
 * components:
 *   schemas:
 *     LocationGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name_en:
 *           type: string
 *           example: Terminal
 *         name_mn:
 *           type: string
 *           example: Терминал
 *     LocationGroupCreateRequest:
 *       type: object
 *       required: [name_en, name_mn]
 *       properties:
 *         name_en:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         name_mn:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *     LocationGroupUpdateRequest:
 *       type: object
 *       properties:
 *         name_en:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         name_mn:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 */

/**
 * @openapi
 * /api/locationGroup:
 *   get:
 *     summary: List location groups
 *     tags: [LocationGroup]
 *     responses:
 *       200:
 *         description: A list of location groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationGroup'
 *   post:
 *     summary: Create a location group
 *     tags: [LocationGroup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationGroupCreateRequest'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationGroup'
 */

/**
 * @openapi
 * /api/locationGroup/{id}:
 *   get:
 *     summary: Get a location group by ID
 *     tags: [LocationGroup]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Location group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationGroup'
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update a location group
 *     tags: [LocationGroup]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationGroupUpdateRequest'
 *     responses:
 *       200:
 *         description: Updated location group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationGroup'
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a location group
 *     tags: [LocationGroup]
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
 *               example: Location group deleted successfully
 *       404:
 *         description: Not found
 */
