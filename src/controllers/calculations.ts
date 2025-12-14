import type { Request, Response, NextFunction } from "express"
import { historyService } from "../services/historyService"
import { CustomError } from "../middleware/customError"

export const handleSaveCalculation = async (req: Request, res: Response, next: NextFunction) => {
  const { calculationType, inputValue, result } = req.body
  const userId = req.session.loggedInUserId

  if (!userId) {
    return next(new CustomError("Not authenticated", 401))
  }

  try {
    await historyService.saveCalculation(userId, calculationType, inputValue, result)
    res.json({ success: true })
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Failed to save calculation", 500))
  }
}

export const handleGetHistory = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.loggedInUserId

  if (!userId) {
    return next(new CustomError("Not authenticated", 401))
  }

  try {
    const history = await historyService.getCalculationHistory(userId)
    res.json(history)
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Failed to fetch history", 500))
  }
}

export const handleDeleteCalculation = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.loggedInUserId
  const calculationId = Number.parseInt(req.params.id)

  if (!userId) {
    return next(new CustomError("Not authenticated", 401))
  }

  try {
    await historyService.deleteCalculation(userId, calculationId)
    res.json({ success: true })
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Failed to delete calculation", 500))
  }
}
