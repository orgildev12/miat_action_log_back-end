import { Request, Response } from 'express';
import { AlogTestService } from '../services/alogTestService';
import { ValidationService } from '../services/validationService';

export class AlogTestController {
  private alogTestService: AlogTestService;

  constructor() {
    this.alogTestService = new AlogTestService();
  }

  async getAllRecords(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.alogTestService.getAllRecords();

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch records',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createRecord(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      const validation = ValidationService.validateName(name);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const result = await this.alogTestService.createRecord(name);

      res.status(201).json({
        success: true,
        message: 'Record created successfully',
        rowsAffected: result.rowsAffected
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getRecordById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const validation = ValidationService.validateId(id);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const result = await this.alogTestService.getRecordById(id);

      if (!result.rows || result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Record not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateRecord(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const idValidation = ValidationService.validateId(id);
      if (!idValidation.isValid) {
        res.status(400).json({
          success: false,
          message: idValidation.error
        });
        return;
      }

      const nameValidation = ValidationService.validateName(name);
      if (!nameValidation.isValid) {
        res.status(400).json({
          success: false,
          message: nameValidation.error
        });
        return;
      }

      const result = await this.alogTestService.updateRecord(id, name);

      if (result.rowsAffected === 0) {
        res.status(404).json({
          success: false,
          message: 'Record not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Record updated successfully',
        rowsAffected: result.rowsAffected
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteRecord(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const validation = ValidationService.validateId(id);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const result = await this.alogTestService.deleteRecord(id);

      if (result.rowsAffected === 0) {
        res.status(404).json({
          success: false,
          message: 'Record not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Record deleted successfully',
        rowsAffected: result.rowsAffected
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
