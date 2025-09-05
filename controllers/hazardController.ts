import { Request, Response } from 'express';
import { HazardService } from '../services/hazardService';
import { Hazard } from '../models/Hazard';

export class HazardController {
  private hazardService = new HazardService();

  async create(req: Request, res: Response): Promise<void> {
    try {
      const hazard = new Hazard({
        user_id: req.body.user_id,
        type_id: req.body.type_id,
        location_id: req.body.location_id,
        description: req.body.description,
        solution: req.body.solution,
        is_private: req.body.is_private || 0,
        status_id: req.body.status_id
      });

      const createdHazard = await this.hazardService.create(hazard);

      res.status(201).json({
        success: true,
        data: createdHazard.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const hazard = await this.hazardService.getById(id);
      
      res.json({
        success: true,
        data: hazard.toJSON()
      });
    } catch (error) {
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: (error as Error).message
        });
      } else {
        res.status(500).json({
          success: false,
          message: (error as Error).message
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const hazards = await this.hazardService.getAll();
      
      res.json({
        success: true,
        data: hazards.map(h => h.toJSON())
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const hazard = new Hazard({
        user_id: req.body.user_id,
        type_id: req.body.type_id,
        location_id: req.body.location_id,
        description: req.body.description,
        solution: req.body.solution,
        is_private: req.body.is_private,
        status_id: req.body.status_id
      });

      const updatedHazard = await this.hazardService.update(id, hazard);
      
      res.json({
        success: true,
        data: updatedHazard.toJSON()
      });
    } catch (error) {
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: (error as Error).message
        });
      } else {
        res.status(400).json({
          success: false,
          message: (error as Error).message
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.hazardService.delete(id);
      
      if (deleted) {
        res.json({
          success: true,
          message: 'Hazard deleted'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Hazard not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  }
}
