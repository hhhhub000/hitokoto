import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiaryStore } from '@/stores/diaryStore';
import { UpdateDiaryRequest } from '@/types';
import Layout from '@/components/layout/Layout';
import DiaryForm from '@/components/diary/DiaryForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const EditDiaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentDiary,
    isLoading,
    isUpdating,
    error,
    fetchDiaryById,
    updateDiary,
    clearError,
    clearCurrentDiary,
  } = useDiaryStore();

  // 日記詳細を取得
  useEffect(() => {
    if (id) {
      fetchDiaryById(id);
    }
    
    return () => {
      clearCurrentDiary();
    };
  }, [id, fetchDiaryById, clearCurrentDiary]);

  // フォーム送信ハンドラー（更新は画像なしのテキストのみ）
  const handleSubmit = async (data: { text: string }): Promise<boolean> => {
    if (!currentDiary || !id) return false;

    clearError();
    const updateData: UpdateDiaryRequest = {
      text: data.text,
    };
    
    const success = await updateDiary(id, updateData);
    
    if (success) {
      navigate(`/diary/${id}`);
    }
    
    return success;
  };

  // キャンセルハンドラー
  const handleCancel = () => {
    if (id) {
      navigate(`/diary/${id}`);
    } else {
      navigate('/');
    }
  };

  // エラー時のリトライ
  const handleRetry = () => {
    if (id) {
      clearError();
      fetchDiaryById(id);
    }
  };

  // ローディング表示
  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" className="py-20" />
      </Layout>
    );
  }

  // エラー表示
  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message={error}
          onRetry={handleRetry}
        />
      </Layout>
    );
  }

  // 日記が見つからない場合
  if (!currentDiary) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h3 className="text-lg font-medium text-gray-900 mb-2">日記が見つかりません</h3>
          <p className="text-gray-600 mb-6">指定された日記は存在しないか、削除された可能性があります。</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            一覧に戻る
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">日記を編集</h1>
          <p className="text-gray-600">
            テキストの内容を編集できます。写真は変更できません。
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 既存の画像表示 */}
        {currentDiary.imageUrl && (
          <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={currentDiary.imageUrl}
              alt="日記の画像"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <DiaryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isUpdating}
            initialData={{ text: currentDiary.text }}
            mode="edit"
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditDiaryPage;