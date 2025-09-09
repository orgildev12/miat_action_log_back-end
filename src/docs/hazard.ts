/**
 * @openapi
 * components:
 *   schemas:
 *     Hazard:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 42 }
 *         code: { type: string, example: HZD-2025-0010 }
 *         user_id: { type: integer, example: 5 }
 *         type_id: { type: integer, example: 2 }
 *         location_id: { type: integer, example: 7 }
 *         description: { type: string, example: Broken handrail on staircase near gate A3. }
 *         solution: { type: string, example: Replace handrail and secure mounting brackets. }
 *         is_private: { type: integer, enum: [0, 1], example: 0 }
 *         isStarted: { type: integer, enum: [0, 1], example: 0 }
 *         isApproved: { type: integer, nullable: true, enum: [0, 1], example: 1 }
 *         isChecking: { type: integer, enum: [0, 1], example: 0 }
 *         isConfirmed: { type: integer, nullable: true, enum: [0, 1], example: 0 }
 *         date_created: { type: string, format: date-time }
 *         date_updated: { type: string, format: date-time }
 *     HazardCreateRequest:
 *       type: object
 *       required: [user_id, type_id, location_id, description, solution]
 *       properties:
 *         user_id: { type: integer }
 *         type_id: { type: integer }
 *         location_id: { type: integer }
 *         description: { type: string }
 *         solution: { type: string }
 *         is_private: { type: integer, enum: [0, 1], description: Defaults to 0 when omitted }
 */

/**
 * @openapi
 * /api/hazards:
 *   get:
 *     summary: List hazards
 *     tags: [Hazard]
 *     responses:
 *       200:
 *         description: A list of hazards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Hazard' }
 *   post:
 *     summary: Create a hazard
 *     tags: [Hazard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HazardCreateRequest' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Hazard' }
 */

/**
 * @openapi
 * /api/hazards/{id}:
 *   get:
 *     summary: Get a hazard by ID
 *     tags: [Hazard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Hazard
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Hazard' }
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a hazard
 *     tags: [Hazard]
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
 *               example: hazard deleted successfully
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /api/hazards/{id}/start-analysis:
 *   put:
 *     summary: Start hazard analysis
 *     tags: [Hazard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Analysis started
 *         content:
 *           application/json:
 *             schema: { type: string, example: hazard analysis started successfully }
 */

/**
 * @openapi
 * /api/hazards/{id}/approve-request:
 *   put:
 *     summary: Approve hazard request
 *     tags: [Hazard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Request approved
 *         content:
 *           application/json:
 *             schema: { type: string, example: hazard request approved successfully }
 */

/**
 * @openapi
 * /api/hazards/{id}/deny-request:
 *   put:
 *     summary: Deny hazard request
 *     tags: [Hazard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Request denied
 *         content:
 *           application/json:
 *             schema: { type: string, example: hazard request denied successfully }
 */

/**
 * @openapi
 * /api/hazards/{id}/start-checking:
 *   put:
 *     summary: Start checking hazard response
 *     tags: [Hazard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Checking started
 *         content:
 *           application/json:
 *             schema: { type: string, example: hazard checking started successfully }
 */

/**
 * @openapi
 * /api/hazards/{id}/confirm-response:
 *   put:
 *     summary: Confirm hazard response
 *     tags: [Hazard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Response confirmed
 *         content:
 *           application/json:
 *             schema: { type: string, example: hazard response confirmed successfully }
 */

/**
 * @openapi
 * /api/hazards/{id}/deny-response:
 *   put:
 *     summary: Deny hazard response
 *     tags: [Hazard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Response denied
 *         content:
 *           application/json:
 *             schema: { type: string, example: hazard response denied successfully }
 */
