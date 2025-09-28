import React, { useEffect, useState } from 'react';
import { useDiaryStore } from '@/stores/diaryStore';
import { Diary } from '@/types';
import Layout from '@/components/layout/Layout';
import DiaryCard from '@/components/diary/DiaryCard';
import Pagination from '@/components/common/Pagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const DiaryListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    diaries,
    pagination,
    isLoading,
    isDeleting,
    error,
    fetchDiaries,
    deleteDiary,
    clearError,
  } = useDiaryStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Diary | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 初回ロード
  useEffect(() => {
    fetchDiaries({ page: currentPage });
  }, [currentPage, fetchDiaries]);

  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // 詳細表示ハンドラー
  const handleView = (diary: Diary) => {
    navigate(`/diary/${diary.id}`);
  };

  // 編集ハンドラー
  const handleEdit = (diary: Diary) => {
    navigate(`/edit/${diary.id}`);
  };

  // 削除確認ダイアログ表示
  const handleDeleteClick = (diary: Diary) => {
    setDeleteTarget(diary);
    setShowDeleteModal(true);
  };

  // 削除実行
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const success = await deleteDiary(deleteTarget.id);
    if (success) {
      setShowDeleteModal(false);
      setDeleteTarget(null);
      
      // 現在のページが空になった場合、前のページに戻る
      if (diaries.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // 同じページを再読み込み
        fetchDiaries({ page: currentPage });
      }
    }
  };

  // 削除キャンセル
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // エラー時のリトライ
  const handleRetry = () => {
    clearError();
    fetchDiaries({ page: currentPage });
  };

  // ローディング表示
  if (isLoading && diaries.length === 0) {
    return (
      <Layout>
        <LoadingSpinner size="lg" className="py-20" />
      </Layout>
    );
  }

  // エラー表示
  if (error && diaries.length === 0) {
    return (
      <Layout>
        <ErrorMessage
          message={error}
          onRetry={handleRetry}
        />
      </Layout>
    );
  }

  // 空状態表示
  if (!isLoading && diaries.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">まだ日記がありません</h3>
          <p className="text-gray-600 mb-6">最初の日記を投稿して、日々の記録を始めましょう。</p>
          <Link to="/create">
            <Button variant="primary" size="lg">
              最初の日記を投稿する
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">日記一覧</h1>
          <Link to="/create">
            <Button variant="primary">
              新しい日記を投稿
            </Button>
          </Link>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
              className="mt-2"
            >
              閉じる
            </Button>
          </div>
        )}

        {/* 日記一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diaries.map((diary) => (
            <DiaryCard
              key={diary.id}
              diary={diary}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>

        {/* ページネーション */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* 削除確認モーダル */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="日記を削除"
        footer={
          <>
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={isDeleting}
            >
              削除する
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          この日記を削除しますか？この操作は取り消せません。
        </p>
        {deleteTarget && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-800">{deleteTarget.text}</p>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default DiaryListPage;