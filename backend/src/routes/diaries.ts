import { Router } from 'express';
import { diaryController } from '../controllers/DiaryController';
import { upload } from '../middleware/upload';
import { validateCreateDiary, validateUpdateDiary, validatePaginationParams } from '../middleware/validation';

const router = Router();

/**
 * 日記関連のAPIルート
 */

// 日記一覧取得 (GET /api/diaries)
router.get('/', validatePaginationParams, diaryController.getDiaries.bind(diaryController));

// 個別日記取得 (GET /api/diaries/:id)
router.get('/:id', diaryController.getDiaryById.bind(diaryController));

// 日記作成 (POST /api/diaries)
router.post('/', 
  upload.single('image'), 
  validateCreateDiary, 
  diaryController.createDiary.bind(diaryController)
);

// 日記更新 (PUT /api/diaries/:id)
router.put('/:id', 
  validateUpdateDiary, 
  diaryController.updateDiary.bind(diaryController)
);

// 日記削除 (DELETE /api/diaries/:id)
router.delete('/:id', diaryController.deleteDiary.bind(diaryController));

export default router;