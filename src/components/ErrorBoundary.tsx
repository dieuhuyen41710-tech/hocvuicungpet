import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border-4 border-[#3B82F6] p-8 max-w-lg w-full text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
              🐾
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1E3A8A]">Đã xảy ra lỗi nhỏ</h2>
              <p className="text-gray-600 font-medium text-sm mt-2">
                Hệ thống đang tải lại dữ liệu tài khoản hoặc giao diện. Vui lòng bấm thử lại để tiếp tục học tập cùng Pet nhé!
              </p>
            </div>
            {this.state.error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl text-left font-mono overflow-auto max-h-24 border border-red-200">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-[#3B82F6] text-white font-black rounded-2xl shadow-[0_4px_0_#1D4ED8] hover:translate-y-0.5 active:translate-y-1 transition-all"
              >
                Về Trang Chủ 🏠
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition-all"
              >
                Tải lại trang 🔄
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
