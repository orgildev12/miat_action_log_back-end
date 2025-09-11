/**
 * @openapi
 * components:
 *   schemas:
 *     Hazard:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 42 }
 *         code: { type: string, example: "FIRE-1" }
 *         statusEn: 
 *           type: string
 *           enum: ['Sent', 'On it', 'Solved', 'Rejected']
 *           example: 'Sent'
 *         statusMn: 
 *           type: string
 *           enum: ['Илгээгдсэн', 'Ажиллаж байна', 'Шийдэгдсэн', 'Татгалзсан']
 *           example: 'Илгээгдсэн'
 *         user_id: { type: integer, nullable: true, example: 5 }
 *         type_id: { type: integer, example: 2 }
 *         location_id: { type: integer, example: 7 }
 *         description: { type: string, maxLength: 1000, example: "Broken handrail on staircase near gate A3." }
 *         solution: { type: string, maxLength: 1000, example: "Replace handrail and secure mounting brackets." }
 *         is_private: { type: integer, enum: [0, 1], example: 0 }
 *         date_created: { type: string, format: date-time }
 *     HazardCreateRequest:
 *       type: object
 *       required: [type_id, location_id, description, solution]
 *       properties:
 *         user_id: { type: integer, nullable: true, description: "User ID - optional" }
 *         type_id: { type: integer, description: "Hazard type ID" }
 *         location_id: { type: integer, description: "Location ID" }
 *         description: { type: string, maxLength: 1000, description: "Hazard description" }
 *         solution: { type: string, maxLength: 1000, description: "Proposed solution" }
 *         is_private: { type: integer, enum: [0, 1], default: 0, description: "Private flag - defaults to 0 when omitted" }
 */

/**
 * @openapi
 * /api/hazards:
 *   get:
 *     summary: List all hazards
 *     tags: [Hazard]
 *     responses:
 *       200:
 *         description: A list of hazards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Hazard' }
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new hazard
 *     tags: [Hazard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/HazardCreateRequest' }
 *     responses:
 *       201:
 *         description: Hazard created successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Hazard' }
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
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
 *         description: The hazard ID
 *     responses:
 *       200:
 *         description: Hazard details
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Hazard' }
 *       404:
 *         description: Hazard not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a hazard
 *     tags: [Hazard]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: The hazard ID
 *     responses:
 *       200:
 *         description: Hazard deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "hazard deleted successfully" }
 *       404:
 *         description: Hazard not found
 *       500:
 *         description: Internal server error
 */


