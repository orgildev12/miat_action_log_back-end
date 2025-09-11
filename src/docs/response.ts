/**
 * @openapi
 * components:
 *   schemas:
 *     Response:
 *       type: object
 *       properties:
 *         hazard_id: { type: integer, example: 42 }
 *         current_status: 
 *           type: string
 *           enum: ['Ирсэн', 'Ажиллаж байгаа', 'Шийдэгдсэн', 'Татгалзсан', 'Шалгаж байгаа', 'Зөвшөөрсөн', 'Буцаасан']
 *           example: 'Ирсэн'
 *         is_started: { type: integer, enum: [0, 1], example: 0 }
 *         response_body: { type: string, nullable: true, example: 'Detailed analysis of the hazard situation...' }
 *         is_request_approved: { type: integer, nullable: true, enum: [0, 1], example: null }
 *         is_response_finished: { type: integer, enum: [0, 1], example: 0 }
 *         response_finished_date: { type: string, format: date-time, nullable: true }
 *         is_checking_response: { type: integer, enum: [0, 1], example: 0 }
 *         is_response_confirmed: { type: integer, enum: [0, 1], example: 0 }
 *         is_response_denied: { type: integer, enum: [0, 1], example: 0 }
 *         reason_to_deny: { type: string, nullable: true, example: 'Insufficient information provided' }
 *         date_updated: { type: string, format: date-time }
 *     ResponseStartAnalysisRequest:
 *       type: object
 *       required: [response_body]
 *       properties:
 *         response_body: { type: string, description: 'Analysis details for the hazard response' }
 *     ResponseApproveRequest:
 *       type: object
 *       properties:
 *         response_body: { type: string, description: 'Optional additional notes for approval' }
 *     ResponseDenyRequest:
 *       type: object
 *       required: [reason_to_deny]
 *       properties:
 *         reason_to_deny: { type: string, description: 'Reason for denying the request' }
 *         response_body: { type: string, description: 'Optional additional details' }
 *     ResponseFinishAnalysisRequest:
 *       type: object
 *       properties:
 *         response_body: { type: string, description: 'Final analysis report' }
 *     ResponseConfirmRequest:
 *       type: object
 *       properties:
 *         response_body: { type: string, description: 'Confirmation notes' }
 *     ResponseDenyResponseRequest:
 *       type: object
 *       required: [reason_to_deny]
 *       properties:
 *         reason_to_deny: { type: string, description: 'Reason for denying the response' }
 */

/**
 * @openapi
 * /api/responses:
 *   get:
 *     summary: List all responses
 *     tags: [Response]
 *     responses:
 *       200:
 *         description: A list of all responses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Response' }
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/responses/{id}:
 *   get:
 *     summary: Get response by hazard ID
 *     tags: [Response]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The hazard ID
 *     responses:
 *       200:
 *         description: Response details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       404:
 *         description: Response not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/responses/{id}/start-analysis:
 *   put:
 *     summary: Start analysis of a hazard response
 *     tags: [Response]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The hazard ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponseStartAnalysisRequest'
 *     responses:
 *       200:
 *         description: Analysis started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Bad request - Analysis already started or invalid state
 *       404:
 *         description: Response not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/responses/{id}/approve-request:
 *   put:
 *     summary: Approve a hazard request
 *     tags: [Response]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The hazard ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponseApproveRequest'
 *     responses:
 *       200:
 *         description: Request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Bad request - Invalid state for approval
 *       404:
 *         description: Response not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/responses/{id}/deny-request:
 *   put:
 *     summary: Deny a hazard request
 *     tags: [Response]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The hazard ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponseDenyRequest'
 *     responses:
 *       200:
 *         description: Request denied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Bad request - Invalid state for denial
 *       404:
 *         description: Response not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/responses/{id}/finish-analysis:
 *   put:
 *     summary: Finish analysis of a hazard response
 *     tags: [Response]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The hazard ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponseFinishAnalysisRequest'
 *     responses:
 *       200:
 *         description: Analysis finished successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Bad request - Analysis not started or already finished
 *       404:
 *         description: Response not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/responses/{id}/start-checking:
 *   put:
 *     summary: Start checking a finished response
 *     tags: [Response]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The hazard ID
 *     responses:
 *       200:
 *         description: Checking started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Bad request - Response not finished or already checking
 *       404:
 *         description: Response not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/responses/{id}/confirm-response:
 *   put:
 *     summary: Confirm a response after checking
 *     tags: [Response]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The hazard ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponseConfirmRequest'
 *     responses:
 *       200:
 *         description: Response confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Bad request - Response not in checking state
 *       404:
 *         description: Response not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/responses/{id}/deny-response:
 *   put:
 *     summary: Deny a response after checking
 *     tags: [Response]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The hazard ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponseDenyResponseRequest'
 *     responses:
 *       200:
 *         description: Response denied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: Bad request - Response not in checking state
 *       404:
 *         description: Response not found
 *       500:
 *         description: Internal server error
 */
