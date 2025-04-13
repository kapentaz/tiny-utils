import { useState } from 'react';

interface DuplicateCheckerProps {
    isDarkMode: boolean;
}

type SortOrder = 'asc' | 'desc';

function DuplicateChecker({ isDarkMode }: DuplicateCheckerProps) {
    const [inputText, setInputText] = useState('');
    const [duplicates, setDuplicates] = useState<{ [key: string]: number }>({});
    const [uniqueItems, setUniqueItems] = useState<string[]>([]);
    const [showUnique, setShowUnique] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [hasChecked, setHasChecked] = useState(false);

    const isAllNumbers = (items: string[]): boolean => {
        return items.every(item => !isNaN(Number(item)) && item.trim() !== '');
    };

    const checkDuplicates = () => {
        // 입력 텍스트를 줄바꿈과 쉼표로 분리
        const items = inputText
            .split(/[\n,]/)
            .map(item => item.trim())
            .filter(item => item.length > 0);

        // 중복 체크
        const counts: { [key: string]: number } = {};
        items.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });

        // 중복된 항목만 필터링
        const duplicatesOnly: { [key: string]: number } = {};
        Object.entries(counts).forEach(([item, count]) => {
            if (count > 1) {
                duplicatesOnly[item] = count;
            }
        });

        setDuplicates(duplicatesOnly);
        setShowUnique(false);
        setHasChecked(true);
    };

    const removeDuplicates = () => {
        const items = inputText
            .split(/[\n,]/)
            .map(item => item.trim())
            .filter(item => item.length > 0);

        const unique = [...new Set(items)];
        setUniqueItems(unique);
        setShowUnique(true);
        setHasChecked(false);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const getSortedUniqueItems = () => {
        const items = [...uniqueItems];
        const allNumbers = isAllNumbers(items);

        return items.sort((a, b) => {
            if (allNumbers) {
                const numA = Number(a);
                const numB = Number(b);
                return sortOrder === 'asc' ? numA - numB : numB - numA;
            } else {
                return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
            }
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-4">            
            <h2 className="text-3xl font-bold mb-2 text-center">🔍 Duplicate Checker</h2>
            <p className="text-center text-gray-600 mb-6">
                Check for duplicate items in your list. Enter items separated by commas or line breaks.
            </p>
            
            <div className="max-w-2xl mx-auto">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter items separated by commas or line breaks
Example:
item1, item2, item3
or
item1
item2
item3"
                    className="w-full h-[24rem] p-4 border rounded bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={checkDuplicates}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={!inputText.trim()}
                >
                    Check Duplicates
                </button>
            </div>

            {Object.keys(duplicates).length > 0 && !showUnique && (
                <div className="rounded-lg shadow p-6 bg-white mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Duplicated Items ({Object.keys(duplicates).length} items)</h3>
                        <button
                            onClick={removeDuplicates}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Remove Duplicates
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {Object.entries(duplicates).map(([item, count]) => (
                            <li key={item} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                                <span className="font-medium">{item}</span>
                                <span className="text-red-600">{count} times</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {Object.keys(duplicates).length === 0 && !showUnique && inputText.trim() && hasChecked && (
                <div className="rounded-lg shadow p-6 bg-white mt-4">
                    <h3 className="text-lg font-semibold text-green-600">No duplicates found!</h3>
                </div>
            )}

            {showUnique && (
                <div className="rounded-lg shadow p-6 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Results ({getSortedUniqueItems().length} items)</h3>
                        <button
                            onClick={toggleSortOrder}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                        </button>
                    </div>
                    <div className="h-[24rem] p-4 border rounded overflow-auto bg-white">
                        {getSortedUniqueItems().map((item, index) => (
                            <div key={index} className="mb-2">{item}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DuplicateChecker; 