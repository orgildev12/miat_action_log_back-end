import { Request, Response } from 'express';
import { AlogTestService } from '../services/alogTestService';
import { ValidationService } from '../services/validationService';
import { 
  PaginationQuery, 
  CreateAlogTestRequest, 
  UpdateAlogTestRequest,
  ApiResponse,
  AlogTestRecord 
} from '../types';

export class AlogTestController {
  private alogTestService: AlogTestService;

  constructor() {
    this.alogTestService = new AlogTestService();
  }

  async getAllRecords(req: Request<{}, ApiResponse<AlogTestRecord[]>, {}, PaginationQuery>, res: Response<ApiResponse<AlogTestRecord[]>>): Promise<void> {
    try {
      const { limit, offset } = req.query;
      
      // Validate pagination parameters
      const validation = ValidationService.validatePagination(limit, offset);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const result = await this.alogTestService.getAllRecords(
        validation.parsedLimit!,
        validation.parsedOffset!
      );

      res.json({
        success: true,
        data: result.rows,
        total: result.rows?.length || 0
      });
    } catch (error) {
      console.error('Error fetching alog_test records:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch alog_test records',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async createRecord(req: Request<{}, ApiResponse, CreateAlogTestRequest>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { name } = req.body;

      // Validate input
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
      console.error('Error creating alog_test record:', error);
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
      console.error('Error fetching alog_test record:', error);
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

      if (!name) {
        res.status(400).json({
          success: false,
          message: 'name is required'
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
      console.error('Error updating alog_test record:', error);
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
      console.error('Error deleting alog_test record:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete record',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
