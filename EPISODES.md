# 편별 실습 코드

영상마다 시작 지점(`epNN-start`)과 완성본(`epNN-end`)을 git 태그로 남깁니다.

| 편 | 영상 | 시작 지점 | 완성본 |
|---|---|---|---|
| 1 | 준비 중 | `ep01-start` | `ep01-end` |

## 따라 하기

```sh
git clone https://github.com/apieceofcoding/airpnp.git
cd airpnp
git switch -c my-ep01 ep01-start
```

완성본과 비교할 때는 `git diff ep01-end -- airpnp-server`. git 없이 받으려면 `https://github.com/apieceofcoding/airpnp/archive/refs/tags/ep01-start.zip`처럼 태그 이름으로 ZIP을 받습니다.

## 제작자용

| 명령 | 하는 일 |
|---|---|
| `scripts/episode.sh prepare 1` | 지금 커밋을 시작 지점으로 표시 |
| `scripts/episode.sh practice 1` | 시작 지점에서 리허설 브랜치 (다시 실행하면 처음부터) |
| `scripts/episode.sh start 1` | 시작 지점에서 녹화 브랜치 |
| `scripts/episode.sh finish 1` | 커밋, 완성본 태그, main에 반영 |
| `git push origin main ep01-start ep01-end` | 영상 발행 때 공개 |

공개한 태그는 옮기지 않습니다. 버그는 다음 편 준비 커밋에서 고칩니다.
