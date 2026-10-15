# 편별 실습 코드

영상마다 **시작 지점**과 **완성본**을 git 태그로 남깁니다. 원하는 편의 시작 지점에서 직접 코드를 쳐 보고, 막히면 완성본과 비교해 보세요.

| 편 | 영상 | 시작 지점 | 완성본 |
|---|---|---|---|
| 1 | 준비 중 | `ep01-start` | `ep01-end` |

## 따라 하기

### git으로 받기

```sh
git clone https://github.com/apieceofcoding/airpnp.git
cd airpnp
git switch -c my-ep01 ep01-start
```

`my-ep01`은 내 연습용 브랜치예요. 여기서 마음껏 코드를 치고 커밋해도 원본은 바뀌지 않습니다.

막혔을 때는 완성본과 비교합니다.

```sh
git diff ep01-end -- airpnp-server
```

다른 편으로 넘어갈 때는 그 편의 시작 지점에서 새 브랜치를 만들어요. 이전 편을 다 못 끝냈어도 바로 시작할 수 있습니다.

```sh
git switch -c my-ep02 ep02-start
```

### ZIP으로 받기

git이 익숙하지 않다면 태그 이름으로 ZIP을 받을 수 있어요.

- 시작 지점: `https://github.com/apieceofcoding/airpnp/archive/refs/tags/ep01-start.zip`
- 완성본: `https://github.com/apieceofcoding/airpnp/archive/refs/tags/ep01-end.zip`

## 저장소 구조

| 이름 | 내용 |
|---|---|
| `main` | 가장 최근에 공개한 편의 완성본 |
| `epNN-start`, `epNN-end` 태그 | 편별 시작 지점과 완성본. 공개한 뒤에는 옮기지 않는다 |
| `reference` 브랜치 | 다음 편을 준비할 때 참고하는 전체 구현. 커리큘럼에서 고칠 결함을 일부러 남겨 둔 상태 |

화면(`airpnp-web`)은 미리 완성해 두었어요. 서버가 숙소의 `id`, `title`, `imageUrl`, `pricePerNight`만 줘도 목록이 뜨고, 서버 응답에 필드가 늘어날수록 화면이 채워집니다. 서버가 꺼져 있거나 아직 없는 API를 부르면 화면에 그 이유를 보여줘요.

## 제작자용: 한 편을 만드는 순서

`scripts/episode.sh`가 아래 순서를 도와줍니다.

1. **준비:** `main`에서 이번 편에 필요한 화면, 설정, 초기 데이터를 커밋하고 시작 지점을 표시한다.
   ```sh
   scripts/episode.sh prepare 1
   ```
2. **리허설:** 시작 지점에서 한 번 미리 쳐 보고 막히는 곳을 기록한다. 다시 하려면 같은 명령을 실행한다.
   ```sh
   scripts/episode.sh practice 1
   ```
3. **녹화:** 시작 지점에서 녹화용 브랜치를 만들고 코드를 치며 녹화한다.
   ```sh
   scripts/episode.sh start 1
   ```
4. **완성:** 녹화한 코드를 커밋하고 완성본으로 표시한다. `main`도 완성본으로 옮겨진다.
   ```sh
   scripts/episode.sh finish 1
   ```
5. **공개:** 영상을 발행할 때 푸시하고 위 표에 영상 링크를 넣는다.
   ```sh
   git push origin main ep01-start ep01-end
   ```

공개한 태그에서 버그를 찾으면 태그를 옮기지 않고, 다음 편 준비 커밋에서 고친 뒤 영상 설명이나 위 표에 적어 둡니다.
