import React, { useState, useEffect, useRef } from "react";
import { MOCK_DATA } from "./api/mockData";

// 데이터를 가져오는 비동기 함수
const getMockData = (pageNum: number): Promise<any[]> => {
  return new Promise((resolve) => {
    // Simulate fetching data from MockData
    const data = MOCK_DATA.slice(pageNum * 10, (pageNum + 1) * 10);
    setTimeout(() => {
      resolve(data); // 1초 후에 데이터를 반환
    }, 1000);
  });
};

const InfiniteScrollComponent: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const currentPage = useRef<number>(0); // 현재 페이지를 추적하기 위한 ref

  const loadMoreData = async () => {
    if (loading || !hasMore) return; // 로딩 중이거나 더 이상 데이터가 없으면 반환

    setLoading(true);
    const nextData = await getMockData(currentPage.current); // 데이터를 비동기적으로 가져오기
    if (nextData.length > 0) {
      setData((prev) => [...prev, ...nextData]); // 기존 데이터에 새로운 데이터 추가
      currentPage.current += 1; // 페이지 증가
    } else {
      setHasMore(false); // 더 이상 데이터가 없으면 hasMore를 false로 설정
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMoreData(); // 컴포넌트가 처음 마운트될 때 데이터 로드
  }, []);

  // 스크롤 이벤트 리스너
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop <
      document.documentElement.offsetHeight - 50
    )
      return; // 50px 가까이 스크롤 시 로드
    loadMoreData();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 등록
    return () => {
      window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 리스너 해제
    };
  }, []);

  // 가격 총합 계산 함수
  const calculateTotalPrice = () => {
    return data.reduce((total, item) => total + item.price, 0);
  };

  return (
    <>
      <div>
        <h1>Infinite Scroll Example</h1>
        <p>Total Price: ${calculateTotalPrice()}</p>
        <ul className="list-wrap">
          {data.map((item) => (
            <li key={item.productId}>
              <h2>{item.productName}</h2>
              <span>price: {item.price}</span>
              <span>boughtDate: {item.boughtDate}</span>
            </li>
          ))}
        </ul>
      </div>
      {loading && <p className="loading">Loading...</p>}
      {!hasMore && <p className="loading">No more items to load.</p>}
    </>
  );
};

export default InfiniteScrollComponent;
