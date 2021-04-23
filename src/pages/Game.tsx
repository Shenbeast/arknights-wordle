import tw from "twin.macro";
import "styled-components/macro";
import { useState, useEffect } from "react";
import Select, { createFilter } from "react-select";
import { char_meta } from "../assets/char_meta";
import { char_data } from "../assets/char_data";
import { module_data } from "../assets/module_data";
import { cleanAlterOperatorName, cleanLabel } from "../utils";
import { OperatorDetails, SelectOption } from "../types";
import OperatorImage from "../components/OperatorImage";
import Button from "../components/Button";
import styled, { keyframes } from "styled-components";

const GameWrapper = tw.div`
  flex
  flex-col
  justify-center
  items-center
`;

interface GuessValue {
  matchType: GuessState;
  value: string;
}

type GuessState = "matchAll" | "matchNone" | "matchPartial" | "display" | "";

interface Guess {
  id: string;
  name: string;
  position: GuessValue;
  class: GuessValue;
  subclass: GuessValue;
  tags: GuessValue;
  nation: GuessValue;
  group: GuessValue;
  module: GuessValue;
}

const GuessWrapper = tw.div`
  flex
  flex-col
  items-center
  gap-4
  py-3
  px-3
  border-4
  border-solid
  border-yellow-700
  mt-4
  mb-8
  bg-gray-600
  text-white
  rounded-md
`;

const SearchWrapper = tw.div`
  w-52
  mb-4
`;

const OperatorSearchOptionWrapper = tw.div`
  flex
  items-center
  justify-start
  gap-4
`;

const OperatorImageWrapper = tw.div`
  w-10
  h-10
`;

const GuessButtonWrapper = tw.div`
  mb-16
`;

const AnswersWrapper = tw.div`
  flex
  flex-col
  gap-4
`;

const AnswersHeader = tw.div`
  flex
  gap-2
`;

const AnswerSquare = styled.div<{ $state: string; $tags: boolean }>`
  height: 5rem;
  width: ${(props) => (props.$tags ? "8rem" : "5rem")};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-transform: capitalize;
  border-radius: 10px;
  background-color: ${(props) =>
    props.$state === "display"
      ? "rgb(31, 32, 34)"
      : props.$state === "matchAll"
      ? "rgb(47, 193, 165)"
      : props.$state === "matchPartial"
      ? "rgb(247, 154, 111)"
      : props.$state === "matchNone"
      ? "rgb(193, 47, 75)"
      : "none"};
`;

const flipAnimation = keyframes`
 0% { transform: rotateY(0) }
 100% { transform: rotateY(180deg)}
`;

const GuessCellWrapper = styled.div<{ $tags: boolean }>`
  background-color: transparent;
  height: 5rem;
  width: ${(props) => (props.$tags ? "8rem" : "5rem")};
`;

const GuessCellInner = styled.div<{ $index: number; $guessIndex: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  animation-name: ${flipAnimation};
  animation-duration: 0.2s;
  animation-delay: ${(props) => `${props.$index * 0.2}s`};
  animation-fill-mode: forwards;
  animation-duration: ${(props) => props.$guessIndex !== 0 && "0s"};
`;

const GuessCellSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
`;

const GuessCellFront = styled(GuessCellSide)`
  background-color: black;
`;

const GuessCellBack = styled(GuessCellSide)<{ $state: string }>`
  background-color: ${(props) =>
    props.$state === "display"
      ? "rgb(31, 32, 34)"
      : props.$state === "matchAll"
      ? "rgb(47, 193, 165)"
      : props.$state === "matchPartial"
      ? "rgb(247, 154, 111)"
      : props.$state === "matchNone"
      ? "rgb(193, 47, 75)"
      : "none"};
  color: white;
  transform: rotateY(180deg);
`;

interface GuessCellProps {
  tags: boolean;
  state: string;
  label: string;
  index: number;
  guessIndex: number;
  id?: string;
  name?: string;
  image?: boolean;
}

const GuessCell = ({
  tags,
  state,
  label,
  index,
  guessIndex,
  id,
  name,
  image,
}: GuessCellProps) => {
  return (
    <GuessCellWrapper $tags={tags}>
      <GuessCellInner $index={index} $guessIndex={guessIndex}>
        <GuessCellFront />
        <GuessCellBack $state={state}>
          {image && id && name ? <OperatorImage id={id} name={name} /> : label}
        </GuessCellBack>
      </GuessCellInner>
    </GuessCellWrapper>
  );
};

const Game = () => {
  const [loading, setLoading] = useState(true);
  const [operatorGuess, setOperatorGuess] = useState<SelectOption>();
  const [operators, setOperators] = useState<OperatorDetails[]>([]);
  const [operatorToGuess, setOperatorToGuess] = useState<OperatorDetails>();
  const [operatorOptions, setOperatorOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [correct, setCorrect] = useState<boolean>(false);
  const answerTitles = [
    "name",
    "position",
    "class",
    "subclass",
    "tags",
    "nation",
    "group",
    "module",
  ];

  const handleGuess = () => {
    if (operatorGuess && operatorToGuess) {
      const guessOperatorDetails = operators.find(
        (operator) => operator.id === operatorGuess.value
      );
      if (guessOperatorDetails) {
        const newGuesses = [...guesses];
        const newGuess: Guess = {
          id: operatorGuess.value,
          name: "",
          position: { matchType: "", value: "" },
          class: { matchType: "", value: "" },
          subclass: { matchType: "", value: "" },
          tags: { matchType: "", value: "" },
          nation: { matchType: "", value: "" },
          group: { matchType: "", value: "" },
          module: { matchType: "", value: "" },
        };
        answerTitles.forEach((answerTitle) => {
          if (answerTitle === "name") {
            newGuess.name = guessOperatorDetails.name;
          } else {
            const correctValues =
              operatorToGuess[answerTitle as keyof OperatorDetails];
            const guessValues =
              guessOperatorDetails[answerTitle as keyof OperatorDetails];
            const guessKey = newGuess[answerTitle as keyof Guess];
            if (typeof guessKey !== "string") {
              guessKey.value = guessValues.toString().replaceAll(",", ", ");
              if (Array.isArray(correctValues) && Array.isArray(guessValues)) {
                const intersection = correctValues.filter(
                  (correctValue: string) => guessValues.includes(correctValue)
                );
                guessKey.matchType =
                  intersection.length === correctValues.length &&
                  guessValues.length === correctValues.length
                    ? "matchAll"
                    : intersection.length > 0
                    ? "matchPartial"
                    : "matchNone";
              } else {
                if (correctValues === guessValues) {
                  guessKey.matchType = "matchAll";
                } else {
                  guessKey.matchType = "matchNone";
                }
              }
            }
          }
        });
        newGuesses.unshift(newGuess);
        setOperatorGuess(
          operatorOptions.filter(
            (option) => option.value !== operatorGuess.value
          )[0]
        );
        setOperatorOptions(
          operatorOptions.filter(
            (option) => option.value !== operatorGuess.value
          )
        );
        if (
          newGuess.class.matchType === "matchAll" &&
          newGuess.group.matchType === "matchAll" &&
          newGuess.module.matchType === "matchAll" &&
          newGuess.nation.matchType === "matchAll" &&
          newGuess.position.matchType === "matchAll" &&
          newGuess.subclass.matchType === "matchAll" &&
          newGuess.tags.matchType === "matchAll"
        ) {
          setCorrect(true);
          const winAlert = () => {
            alert(
              `You've guessed the correct operator: ${operatorToGuess.name}!`
            );
            return true;
          };
          setTimeout(winAlert, 2000);
        }
        setGuesses(newGuesses);
      }
    }
  };

  useEffect(() => {
    const _operatorDetails: OperatorDetails[] = [];
    for (const operator in char_meta) {
      char_meta[operator].forEach((operatorVersion) => {
        const module = module_data[operatorVersion];
        const operator = char_data[operatorVersion];
        if (operator.skills.length !== 0) {
          _operatorDetails.push({
            id: operatorVersion,
            name: cleanAlterOperatorName(operator.name),
            position: operator.position,
            tags: operator.tagList || [],
            rarity: operator.rarity + 1,
            group: operator.groupId || "none",
            class: operator.profession,
            subclass: operator.subProfessionId,
            module: module !== undefined,
            nation: operator.nationId || "none",
          });
        }
      });
    }
    const _operatorToGuess =
      _operatorDetails[Math.floor(Math.random() * _operatorDetails.length)];
    setOperatorToGuess(_operatorToGuess);
    setOperators(_operatorDetails);
    const mappedOptions = _operatorDetails.map((option) => ({
      value: option.id,
      label: option.name,
    }));
    setOperatorOptions(mappedOptions);
    setLoading(false);
  }, []);
  return (
    <GameWrapper className="game-wrapper">
      <GuessWrapper className="guess-wrapper">
        <span>Guess the Arknights operator!</span>
      </GuessWrapper>
      {!loading && operators && (
        <SearchWrapper>
          <Select
            options={operatorOptions}
            value={operatorGuess}
            onChange={(e) => e && setOperatorGuess(e)}
            filterOption={createFilter({
              matchFrom: "any",
              stringify: (option) => `${option.label}`,
            })}
            formatOptionLabel={(operatorOption) => (
              <OperatorSearchOptionWrapper>
                <OperatorImageWrapper>
                  <OperatorImage
                    id={operatorOption.value}
                    name={operatorOption.label}
                  />
                </OperatorImageWrapper>
                <span>{operatorOption.label}</span>
              </OperatorSearchOptionWrapper>
            )}
          />
        </SearchWrapper>
      )}
      <GuessButtonWrapper>
        <Button
          onClick={() => handleGuess()}
          disabled={!operatorGuess || correct}
        >
          Guess
        </Button>
      </GuessButtonWrapper>
      <AnswersWrapper>
        <AnswersHeader>
          {answerTitles.map((answerTitle) => (
            <AnswerSquare
              key={answerTitle}
              $state="display"
              $tags={answerTitle === "tags"}
            >
              {answerTitle}
            </AnswerSquare>
          ))}
        </AnswersHeader>
        {guesses.map((guess, guessIndex) => (
          <AnswersHeader key={guess.name}>
            {answerTitles.map((answerTitle, index) => {
              const guessKey = guess[answerTitle as keyof Guess];
              const correct = operatorToGuess?.name === guess.name;
              return typeof guessKey !== "string" ? (
                <GuessCell
                  key={index}
                  state={guessKey.matchType}
                  tags={answerTitle === "tags"}
                  label={cleanLabel(guessKey.value)}
                  index={index}
                  guessIndex={guessIndex}
                />
              ) : (
                <GuessCell
                  key={index}
                  state={correct ? "matchAll" : "display"}
                  tags={answerTitle === "tags"}
                  label={guessKey}
                  index={index}
                  id={guess.id}
                  name={guess.name}
                  image={true}
                  guessIndex={guessIndex}
                />
              );
            })}
          </AnswersHeader>
        ))}
      </AnswersWrapper>
    </GameWrapper>
  );
};

export default Game;
