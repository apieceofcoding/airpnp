#!/usr/bin/env bash
# 편별 실습 코드를 git 태그로 관리합니다. 사용법은 EPISODES.md를 참고하세요.
set -euo pipefail

usage() {
	cat <<'EOF'
사용법: scripts/episode.sh <명령> <편 번호>

  prepare  <편>  지금 커밋을 그 편의 시작 지점으로 표시 (epNN-start 태그)
  practice <편>  시작 지점에서 리허설용 practice/epNN 브랜치를 새로 만든다 (이전 리허설은 버린다)
  start    <편>  시작 지점에서 녹화용 record/epNN 브랜치를 만든다
  finish   <편>  녹화한 코드를 커밋하고 완성본으로 표시 (epNN-end 태그, main에 반영)
  diff     <편>  그 편에서 바뀐 코드 전체를 보여준다
EOF
	exit 1
}

[[ $# -eq 2 ]] || usage
command=$1
episode=$(printf 'ep%02d' "$((10#$2))")
start_tag="$episode-start"
end_tag="$episode-end"

require_clean() {
	if [[ -n $(git status --porcelain) ]]; then
		echo "커밋하지 않은 변경이 있어요. 먼저 커밋하거나 정리해 주세요." >&2
		exit 1
	fi
}

require_tag() {
	if ! git rev-parse -q --verify "refs/tags/$1" >/dev/null; then
		echo "$1 태그가 없어요." >&2
		exit 1
	fi
}

refuse_existing_tag() {
	if git rev-parse -q --verify "refs/tags/$1" >/dev/null; then
		echo "$1 태그가 이미 있어요. 공개된 태그는 옮기지 않습니다." >&2
		exit 1
	fi
}

case $command in
	prepare)
		require_clean
		refuse_existing_tag "$start_tag"
		git tag -a "$start_tag" -m "$episode 시작 지점"
		echo "$start_tag 를 $(git rev-parse --short HEAD)에 표시했어요."
		;;
	practice)
		require_clean
		require_tag "$start_tag"
		git switch -C "practice/$episode" "$start_tag"
		echo "리허설을 시작하세요. 다시 처음부터 하려면 같은 명령을 한 번 더 실행합니다."
		;;
	start)
		require_clean
		require_tag "$start_tag"
		git switch -c "record/$episode" "$start_tag"
		echo "녹화를 시작하세요. 끝나면 scripts/episode.sh finish $2"
		;;
	finish)
		refuse_existing_tag "$end_tag"
		if [[ $(git branch --show-current) != "record/$episode" ]]; then
			echo "record/$episode 브랜치에서 실행해 주세요." >&2
			exit 1
		fi
		git add -A
		git commit -m "$episode 완성"
		git tag -a "$end_tag" -m "$episode 완성본"
		git switch main
		git merge --ff-only "record/$episode"
		echo "$end_tag 를 표시하고 main에 반영했어요. 공개하려면: git push origin main $start_tag $end_tag"
		;;
	diff)
		require_tag "$start_tag"
		require_tag "$end_tag"
		git diff "$start_tag" "$end_tag"
		;;
	*)
		usage
		;;
esac
