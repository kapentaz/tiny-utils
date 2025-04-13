import { useState } from 'react';

interface ListComparatorProps {
    isDarkMode?: boolean;
}

type SortOrder = 'asc' | 'desc';

function ListComparator({ isDarkMode }: ListComparatorProps) {
    const [listA, setListA] = useState('');
    const [listB, setListB] = useState('');
    const [onlyInA, setOnlyInA] = useState<string[]>([]);
    const [onlyInB, setOnlyInB] = useState<string[]>([]);
    const [intersection, setIntersection] = useState<string[]>([]);
    const [union, setUnion] = useState<string[]>([]);
    const [sortOrders, setSortOrders] = useState({
        onlyInA: 'asc' as SortOrder,
        onlyInB: 'asc' as SortOrder,
        intersection: 'asc' as SortOrder,
        union: 'asc' as SortOrder
    });

    const isAllNumbers = (items: string[]) => {
        return items.every(item => !isNaN(Number(item)));
    };

    const sortItems = (items: string[], order: SortOrder = 'asc') => {
        const isNumeric = isAllNumbers(items);
        const sorted = [...items].sort((a, b) => {
            if (isNumeric) {
                return order === 'asc' ? Number(a) - Number(b) : Number(b) - Number(a);
            }
            return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
        });
        return sorted;
    };

    const toggleSort = (setName: keyof typeof sortOrders) => {
        setSortOrders(prev => {
            const newOrder = prev[setName] === 'asc' ? 'desc' : 'asc';
            const newOrders = { ...prev, [setName]: newOrder };

            // 정렬 순서가 변경될 때 해당 집합 재정렬
            switch (setName) {
                case 'onlyInA':
                    setOnlyInA(sortItems(onlyInA, newOrder));
                    break;
                case 'onlyInB':
                    setOnlyInB(sortItems(onlyInB, newOrder));
                    break;
                case 'intersection':
                    setIntersection(sortItems(intersection, newOrder));
                    break;
                case 'union':
                    setUnion(sortItems(union, newOrder));
                    break;
            }

            return newOrders;
        });
    };

    const removeDuplicates = (setName: keyof typeof sortOrders) => {
        switch (setName) {
            case 'onlyInA':
                setOnlyInA([...new Set(onlyInA)]);
                break;
            case 'onlyInB':
                setOnlyInB([...new Set(onlyInB)]);
                break;
            case 'intersection':
                setIntersection([...new Set(intersection)]);
                break;
            case 'union':
                setUnion([...new Set(union)]);
                break;
        }
    };

    const compareLists = () => {
        // 입력된 텍스트를 콤마나 엔터 기준으로 분리하고 공백 제거
        const itemsA = listA.split(/[\n,]/).map(item => item.trim()).filter(item => item);
        const itemsB = listB.split(/[\n,]/).map(item => item.trim()).filter(item => item);

        // A에만 있는 항목 (중복 제거)
        const onlyA = [...new Set(itemsA.filter(item => !itemsB.includes(item)))];
        setOnlyInA(sortItems(onlyA, sortOrders.onlyInA));

        // B에만 있는 항목 (중복 제거)
        const onlyB = [...new Set(itemsB.filter(item => !itemsA.includes(item)))];
        setOnlyInB(sortItems(onlyB, sortOrders.onlyInB));

        // 교집합 (중복 제거)
        const intersect = [...new Set(itemsA.filter(item => itemsB.includes(item)))];
        setIntersection(sortItems(intersect, sortOrders.intersection));

        // 합집합 (중복 제거)
        const unionSet = new Set([...itemsA, ...itemsB]);
        setUnion(sortItems([...unionSet], sortOrders.union));
    };

    const SortButton = ({ setName }: { setName: keyof typeof sortOrders }) => (
        <button
            onClick={() => toggleSort(setName)}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            title={sortOrders[setName] === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
        >
            {sortOrders[setName] === 'asc' ? 'Descending' : 'Ascending'}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto p-4">            
            <h2 className="text-3xl font-bold mb-2 text-center">🔄 List Comparator</h2>
            <p className="text-center text-gray-600 mb-6">
                Compare two lists to find differences and unions. All results are displayed with duplicates removed.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">List A</h3>
                    <textarea
                        value={listA}
                        onChange={(e) => setListA(e.target.value)}
                        placeholder="item1, item2, item3
or
item1
item2
item3"
                        className="w-full h-[24rem] p-4 border rounded bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">List B</h3>
                    <textarea
                        value={listB}
                        onChange={(e) => setListB(e.target.value)}
                        placeholder="item1, item2, item3
or
item1
item2
item3"
                        className="w-full h-[24rem] p-4 border rounded bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex justify-center mb-8">
                <button
                    onClick={compareLists}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={!listA && !listB}
                >
                    Compare
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold">Only in A ({onlyInA.length} items)</h3>
                        <div className="flex items-center">
                            <SortButton setName="onlyInA" />
                        </div>
                    </div>
                    <div className="h-[24rem] p-4 border rounded overflow-auto bg-white">
                        {onlyInA.map((item, index) => (
                            <div key={index} className="mb-2">{item}</div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold">Only in B ({onlyInB.length} items)</h3>
                        <div className="flex items-center">
                            <SortButton setName="onlyInB" />
                        </div>
                    </div>
                    <div className="h-[24rem] p-4 border rounded overflow-auto bg-white">
                        {onlyInB.map((item, index) => (
                            <div key={index} className="mb-2">{item}</div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold">Intersection ({intersection.length} items)</h3>
                        <div className="flex items-center">
                            <SortButton setName="intersection" />
                        </div>
                    </div>
                    <div className="h-[24rem] p-4 border rounded overflow-auto bg-white">
                        {intersection.map((item, index) => (
                            <div key={index} className="mb-2">{item}</div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold">Union ({union.length} items)</h3>
                        <div className="flex items-center">
                            <SortButton setName="union" />
                        </div>
                    </div>
                    <div className="h-[24rem] p-4 border rounded overflow-auto bg-white">
                        {union.map((item, index) => (
                            <div key={index} className="mb-2">{item}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListComparator; 