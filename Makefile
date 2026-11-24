all: up

up:
	docker compose up -d --build

clean:
	docker compose down

fclean: clean
	docker system prune -a --volumes

re: fclean all

.PHONY: up re fclean clean all