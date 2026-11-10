NAME=spaceio

all: $(NAME)

$(NAME):
	docker compose up -d --build

clean:
	docker compose down

fclean: clean
	docker system prune -a --volumes

re: fclean all

.PHONY: re fclean clean all