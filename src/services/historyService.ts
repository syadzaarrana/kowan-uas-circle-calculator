import { promisePool } from "../database"

export const historyService = {
  async saveCalculation(userId: string, calculationType: string, inputValue: number, result: number) {
    try {
      await promisePool.query(
        "INSERT INTO calculation_history (user_id, calculation_type, input_value, result) VALUES (?, ?, ?, ?)",
        [userId, calculationType, inputValue, result],
      )
    } catch (error) {
      throw error
    }
  },

  async getCalculationHistory(userId: string) {
    try {
      const [rows] = await promisePool.query(
        "SELECT id, calculation_type, input_value, result, created_at FROM calculation_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
        [userId],
      )
      return rows
    } catch (error) {
      return []
    }
  },

  async deleteCalculation(userId: string, calculationId: number) {
    try {
      await promisePool.query("DELETE FROM calculation_history WHERE id = ? AND user_id = ?", [calculationId, userId])
    } catch (error) {
      throw error
    }
  },
}
