import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiaryStore } from '@/stores/diaryStore';
import { CreateDiaryRequest } from '@/types';
import Layout from '@/components/layout/Layout';
import DiaryForm from '@/components/diary/DiaryForm';

const CreateDiaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { createDiary, isCreating, error, clearError } = useDiaryStore();

  // フォーム送信ハンドラー
  const handleSubmit = async (data: CreateDiaryRequest): Promise<boolean> => {
    clearError();
    const success = await createDiary(data);
    
    if (success) {
      navigate('/');
    }
    
    return success;
  };

  // キャンセルハンドラー
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">新しい日記を投稿</h1>
          <p className="text-gray-600">
            今日の出来事や気持ちを写真と一緒に記録しましょう。
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <DiaryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isCreating}
            mode="create"
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreateDiaryPage;