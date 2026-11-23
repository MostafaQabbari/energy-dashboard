type Props = {
    message: string;
    onRetry: () => void;
};

export default function ErrorMessage({ message, onRetry }: Props) {
    return (
        <div className="rounded border border-red-300 bg-red-50 p-4">
            <p className="text-red-700">Something went wrong: {message}</p>
            <button className="mt-2 rounded bg-red-600 px-3 py-1 text-white" onClick={onRetry}>
                Retry
            </button>
        </div>
    );
}