const { createApp } = Vue;

createApp({
	data() {
		return {
			items: [],
			no: null
		}
	},
	mounted() {
		this.detailOne();
	},
	methods: {
		//로그인
		getUserId() {
			return 'user01';
		},
		detailOne() {
			//window.location (Location 객체) 가져오기
			// ""                   window.location.port
			// "/325"               window.location.pathname 
			// ?category=764998"    window.location.search
			const url = new URLSearchParams(window.location.search);
			// const mno = url.get('mno'); > 이 메서드에서만 사용할게 아니기에 전역으로 넘김
			this.no = url.get('no');

			if (this.no) {
				axios.get(`http://localhost/fleaMarket/${this.no}`)
					.then(response => {
						this.items = response.data;
					})
					.catch(err => {
						console.log("fleaDetail Axios error: ", err);
					});
			} else {
				console.log("url에 번호 없음");
			}
		},
		getFirstFilePath(filePath) {
			return Array.isArray(filePath) ? filePath[0] : filePath;
		},
		fleaUpdate() { //수정 버튼
			window.location.href = `fleamarketUpdate.html?no=${this.no}`
		},
		fleaDelete() { //삭제 버튼
			res = confirm('다시 되돌릴 수 없습니다. 삭제하시겠습니까?');
			if (!res) {
				console.log('취소하였습니다.');
			} else {
				axios.delete(`http://localhost/fleaMarket/${this.no}`)
					.then(response => {
						console.log(response);
						alert('삭제되었습니다.');
						window.location.href = `http://localhost/fleamarket.html`;
					})
					.catch(err => {
						alert('삭제에 실패했습니다.');
						window.location.href = `http://localhost/fleamarket.html`;
					});
			}
		},
		//--- 신고하기 모달----
		report(no) {
			this.isModalOpen = true; // 모달 열기
		},
		closeModal() {
			this.isModalOpen = false; // 모달 닫기
		},
		submitReport() {
			// 신고 처리 로직
			axios.post(`/fleaMarket/report/${this.no}`, { reason: this.reportReason, userid: this.getUserId() })
				.then(response => {
					console.log("신고 처리 완료");
					this.reportReason = ''; // 입력값 초기화
					this.closeModal(); // 모달 닫기
				})
				.catch(error => {
					console.error("신고 처리 실패", error);
				});
		},
		//---------------
		list() {
			window.location.href = `/fleamarket.html`;
		},
		//좋아요--
		toggleFavorite(item) {
			// 좋아요 상태를 토글
			item.favorite = !item.favorite;
			// 서버에 좋아요 상태를 업데이트할 필요가 있는 경우
			if (item.favorite) {
				// 좋아요 추가 요청
				this.addFavorite(item.no);
			} else {
				// 좋아요 취소 요청
				this.removeFavorite(item.no);
			}
		},
		addFavorite(itemNo) {
			// 서버에 좋아요 추가 요청을 보내는 로직
			axios.patch(`/fleaMarket/favorite/${this.no}`, { userid: this.getUserId() })
				.then(response => {
					console.log(response);
					console.log("좋아요 추가됨");
				})
				.catch(error => {
					console.error("좋아요 추가 실패", error);
				});
		},
		removeFavorite(itemNo) {
			// 서버에 좋아요 취소 요청을 보내는 로직
			axios.patch(`/fleaMarket/favorite/${this.no}`, { userid: this.getUserId() })
				.then(response => {
					console.log("좋아요 취소됨");
				})
				.catch(error => {
					console.error("좋아요 취소 실패", error);
				});
		}
		//----------
	},
}).mount("#detail");