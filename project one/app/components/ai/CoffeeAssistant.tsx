import {useState} from "react";
import {Link} from "react-router";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
  recommendation?: Recommendation | null;
};

type Recommendation = {
  id?: string;
  handle?: string;
  title?: string;
  image?: string;
  price?: string;
  origin?: string;
  roast?: string;
  notes?: string;
  intensity?: string | number;
  category?: string;
};

type AssistantResponse = {
  response?: string;
  error?: string;
  recommendation?: Recommendation | null;
};

type GuideStep =
  | "roast"
  | "flavor"
  | "intensity"
  | "done";

type GuideAnswers = {
  roast: string;
  flavor: string;
  intensity: string;
};

const guideOptions = {
  roast: [
    "Light",
    "Medium",
    "Dark",
  ],

  flavor: [
    "Chocolatey",
    "Fruity",
    "Nutty",
    "Sweet",
    "Citrusy",
  ],

  intensity: [
    "Mild",
    "Balanced",
    "Strong",
  ],
};


/*
 * ==================================================
 * COMPONENT
 * ==================================================
 */

export default function CoffeeAssistant() {

  const [isOpen, setIsOpen] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [guideStep, setGuideStep] =
    useState<GuideStep>("done");

  const [guideAnswers, setGuideAnswers] =
    useState<GuideAnswers>({
      roast: "",
      flavor: "",
      intensity: "",
    });

  const [messages, setMessages] =
    useState<Message[]>([
      {
        id: 1,

        role: "assistant",

        text:
          "Hi. I'm Java's coffee assistant. Tell me what kind of coffee you're looking for.",
      },
    ]);


  /*
   * ==================================================
   * ADD MESSAGE
   * ==================================================
   */

  function addMessage(
    role: "assistant" | "user",
    text: string,
    recommendation?: Recommendation | null,
  ) {

    setMessages((current) => [
      ...current,

      {
        id:
          Date.now() +
          Math.random(),

        role,

        text,

        recommendation:
          recommendation ?? null,
      },
    ]);
  }


  /*
   * ==================================================
   * FIND MY COFFEE
   * ==================================================
   */

  function startGuide() {

    setGuideAnswers({
      roast: "",
      flavor: "",
      intensity: "",
    });

    setGuideStep("roast");

    addMessage(
      "assistant",
      "Let's find your coffee. I'll ask you three quick questions.",
    );

    addMessage(
      "assistant",
      "What roast do you prefer?",
    );
  }


  /*
   * ==================================================
   * GUIDED QUESTIONS
   * ==================================================
   */

  function handleGuideAnswer(
    answer: string,
  ) {

    if (
      isLoading ||
      guideStep === "done"
    ) {
      return;
    }


    addMessage(
      "user",
      answer,
    );


    /*
     * ROAST
     */

    if (
      guideStep === "roast"
    ) {

      setGuideAnswers(
        (current) => ({
          ...current,

          roast:
            answer,
        }),
      );

      setGuideStep("flavor");

      addMessage(
        "assistant",
        "What flavor profile sounds best?",
      );

      return;
    }


    /*
     * FLAVOR
     */

    if (
      guideStep === "flavor"
    ) {

      setGuideAnswers(
        (current) => ({
          ...current,

          flavor:
            answer,
        }),
      );

      setGuideStep("intensity");

      addMessage(
        "assistant",
        "How intense do you like your coffee?",
      );

      return;
    }


    /*
     * INTENSITY
     *
     * For the final answer we send the
     * selections through the same API.
     */

    if (
      guideStep === "intensity"
    ) {

      const finalAnswers = {
        ...guideAnswers,

        intensity:
          answer,
      };


      setGuideAnswers(
        finalAnswers,
      );

      setGuideStep("done");


      /*
       * Build a natural-language query
       * that the existing API understands.
       */

      const query =
        `I want a ${finalAnswers.roast.toLowerCase()} roast coffee with a ${finalAnswers.flavor.toLowerCase()} flavor and ${finalAnswers.intensity.toLowerCase()} intensity.`;


      submitQuestion(query);
    }
  }


  /*
   * ==================================================
   * API REQUEST
   * ==================================================
   */

  async function submitQuestion(
    question: string,
  ) {

    if (
      !question ||
      isLoading
    ) {
      return;
    }


    setIsLoading(true);


    try {

      const response =
        await fetch(
          "/api/coffee-assistant",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                query:
                  question,
              }),
          },
        );


      const data =
        (await response.json()) as AssistantResponse;


      console.log(
        "JAVA AI RESPONSE:",
        data,
      );


      if (
        !response.ok
      ) {

        throw new Error(
          data.error ??
            "Coffee assistant request failed.",
        );
      }


      /*
       * ==================================================
       * IMPORTANT
       * ==================================================
       *
       * The API returns BOTH:
       *
       * data.response
       *
       * AND
       *
       * data.recommendation
       *
       * We attach the recommendation directly
       * to the assistant message.
       *
       * This means the card is no longer dependent
       * on a separate recommendation state.
       */

      addMessage(
        "assistant",

        data.response ??
          "I couldn't find a recommendation.",

        data.recommendation ??
          null,
      );

    } catch (error) {

      console.error(
        "JAVA AI ERROR:",
        error,
      );


      addMessage(
        "assistant",
        "Sorry, I couldn't connect to the coffee assistant right now.",
      );

    } finally {

      setIsLoading(false);

    }
  }


  /*
   * ==================================================
   * FREE TEXT SUBMIT
   * ==================================================
   */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();


    const question =
      input.trim();


    if (
      !question ||
      isLoading
    ) {
      return;
    }


    setGuideStep("done");


    setGuideAnswers({
      roast: "",
      flavor: "",
      intensity: "",
    });


    addMessage(
      "user",
      question,
    );


    setInput("");


    await submitQuestion(
      question,
    );
  }


  /*
   * ==================================================
   * TRY ANOTHER COFFEE
   * ==================================================
   */

  function tryAnotherCoffee() {

    setGuideStep("done");

    setGuideAnswers({
      roast: "",
      flavor: "",
      intensity: "",
    });

    addMessage(
      "assistant",
      "Sure. Tell me what kind of coffee you'd like to try next.",
    );
  }


  /*
   * ==================================================
   * CURRENT GUIDED OPTIONS
   * ==================================================
   */

  const currentOptions =
    guideStep !== "done"
      ? guideOptions[
          guideStep
        ]
      : [];


  /*
   * ==================================================
   * RENDER
   * ==================================================
   */

  return (
    <>
      {isOpen && (

        <section
          className="ai-chat"
        >

          {/* ==========================================
              HEADER
          ========================================== */}

          <header
            className="ai-chat-header"
          >

            <div>

              <span
                className="ai-chat-eyebrow"
              >
                JAVA AI
              </span>

              <h2>
                Coffee Assistant
              </h2>

            </div>


            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              aria-label="Close coffee assistant"
            >
              ×
            </button>

          </header>


          {/* ==========================================
              MESSAGES
          ========================================== */}

          <div
            className="ai-chat-messages"
          >

            {messages.map(
              (message) => (

                <div
                  key={
                    message.id
                  }
                >

                  {/* MESSAGE */}

                  <div
                    className={`ai-chat-message ${
                      message.role ===
                      "user"
                        ? "ai-chat-message-user"
                        : "ai-chat-message-assistant"
                    }`}
                  >
                    {
                      message.text
                    }
                  </div>


                  {/* ==================================
                      PRODUCT CARD
                  ================================== */}

                  {message.role ===
                    "assistant" &&
                    message.recommendation && (

                    <article
                      className="ai-recommendation"
                      style={{
                        display:
                          "block",

                        width:
                          "100%",

                        marginTop:
                          "12px",

                        marginBottom:
                          "12px",

                        overflow:
                          "hidden",

                        border:
                          "1px solid #ddd4ca",

                        borderRadius:
                          "8px",

                        background:
                          "#ffffff",

                        boxSizing:
                          "border-box",

                        boxShadow:
                          "0 2px 8px rgba(36,29,25,0.08)",
                      }}
                    >

                      {/* IMAGE */}

                      <div
                        style={{
                          width:
                            "100%",

                          height:
                            "180px",

                          overflow:
                            "hidden",

                          background:
                            "#eee7df",
                        }}
                      >

                        {message
                          .recommendation
                          .image ? (

                          <img
                            src={
                              message
                                .recommendation
                                .image
                            }

                            alt={
                              message
                                .recommendation
                                .title ??
                              "Coffee"
                            }

                            style={{
                              display:
                                "block",

                              width:
                                "100%",

                              height:
                                "100%",

                              objectFit:
                                "cover",
                            }}

                            onError={(
                              event,
                            ) => {

                              console.error(
                                "JAVA AI IMAGE FAILED:",
                                event
                                  .currentTarget
                                  .src,
                              );

                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                        ) : (

                          <div
                            style={{
                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              width:
                                "100%",

                              height:
                                "100%",

                              color:
                                "#8a7b6e",

                              fontSize:
                                "12px",
                            }}
                          >
                            Coffee
                          </div>

                        )}

                      </div>


                      {/* CARD CONTENT */}

                      <div
                        style={{
                          padding:
                            "16px",
                        }}
                      >

                        {/* CATEGORY */}

                        <span
                          style={{
                            display:
                              "block",

                            marginBottom:
                              "6px",

                            fontSize:
                              "10px",

                            fontWeight:
                              700,

                            letterSpacing:
                              "0.12em",

                            textTransform:
                              "uppercase",

                            color:
                              "#8a7b6e",
                          }}
                        >
                          {
                            message
                              .recommendation
                              .category ??
                            "Coffee"
                          }
                        </span>


                        {/* TITLE */}

                        <h3
                          style={{
                            margin:
                              "0 0 7px",

                            fontSize:
                              "18px",

                            lineHeight:
                              "1.2",

                            color:
                              "#241d19",
                          }}
                        >
                          {
                            message
                              .recommendation
                              .title ??
                            "Recommended Coffee"
                          }
                        </h3>


                        {/* ORIGIN / ROAST */}

                        <p
                          style={{
                            margin:
                              "0 0 8px",

                            fontSize:
                              "12px",

                            lineHeight:
                              "1.4",

                            color:
                              "#75685e",
                          }}
                        >

                          {
                            message
                              .recommendation
                              .origin
                          }

                          {
                            message
                              .recommendation
                              .origin &&
                            message
                              .recommendation
                              .roast
                              ? " · "
                              : ""
                          }

                          {
                            message
                              .recommendation
                              .roast
                          }

                        </p>


                        {/* NOTES */}

                        {message
                          .recommendation
                          .notes && (

                          <p
                            style={{
                              margin:
                                "0 0 15px",

                              fontSize:
                                "12px",

                              lineHeight:
                                "1.5",

                              color:
                                "#514840",
                            }}
                          >
                            {
                              message
                                .recommendation
                                .notes
                            }
                          </p>

                        )}


                        {/* PRICE / VIEW */}

                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "space-between",

                            gap:
                              "16px",
                          }}
                        >

                          <strong
                            style={{
                              display:
                                "block",

                              flexShrink:
                                0,

                              fontSize:
                                "16px",

                              color:
                                "#241d19",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {
                              message
                                .recommendation
                                .price
                            }
                          </strong>


                          {message
                            .recommendation
                            .handle ? (

                            <Link
                              to={`/products/${message.recommendation.handle}`}
                              style={{
                                display:
                                  "inline-flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                padding:
                                  "9px 14px",

                                borderRadius:
                                  "4px",

                                background:
                                  "#241d19",

                                color:
                                  "#ffffff",

                                textDecoration:
                                  "none",

                                fontSize:
                                  "11px",

                                fontWeight:
                                  600,

                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              View Coffee
                            </Link>

                          ) : null}

                        </div>


                        {/* TRY ANOTHER */}

                        <button
                          type="button"
                          onClick={
                            tryAnotherCoffee
                          }
                          style={{
                            display:
                              "block",

                            width:
                              "100%",

                            marginTop:
                              "11px",

                            padding:
                              "9px 12px",

                            border:
                              "1px solid #d4cbc2",

                            borderRadius:
                              "4px",

                            background:
                              "#f8f5f1",

                            color:
                              "#514840",

                            fontFamily:
                              "inherit",

                            fontSize:
                              "11px",

                            cursor:
                              "pointer",
                          }}
                        >
                          Try another coffee
                        </button>

                      </div>

                    </article>

                  )}

                </div>

              ),
            )}


            {/* LOADING */}

            {isLoading && (

              <div
                className="ai-chat-message ai-chat-message-assistant"
              >
                Finding your coffee...
              </div>

            )}


            {/* ========================================
                GUIDED OPTIONS
            ======================================== */}

            {guideStep !==
              "done" &&
              !isLoading && (

              <div
                style={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap:
                    "8px",

                  marginTop:
                    "10px",

                  marginBottom:
                    "10px",
                }}
              >

                {currentOptions.map(
                  (option) => (

                    <button
                      key={
                        option
                      }

                      type="button"

                      onClick={() =>
                        handleGuideAnswer(
                          option,
                        )
                      }

                      style={{
                        width:
                          "100%",

                        padding:
                          "11px 13px",

                        border:
                          "1px solid #d8cec4",

                        borderRadius:
                          "4px",

                        background:
                          "#f8f5f1",

                        color:
                          "#302722",

                        fontFamily:
                          "inherit",

                        fontSize:
                          "12px",

                        textAlign:
                          "left",

                        cursor:
                          "pointer",
                      }}
                    >
                      {
                        option
                      }
                    </button>

                  ),
                )}

              </div>

            )}


            {/* ========================================
                FIND MY COFFEE
            ======================================== */}

            {guideStep ===
              "done" &&
              !isLoading &&
              !messages.some(
                (message) =>
                  message.recommendation,
              ) && (

              <button
                type="button"

                onClick={
                  startGuide
                }

                style={{
                  display:
                    "block",

                  width:
                    "100%",

                  marginTop:
                    "12px",

                  padding:
                    "11px 14px",

                  border:
                    "none",

                  borderRadius:
                    "4px",

                  background:
                    "#241d19",

                  color:
                    "#ffffff",

                  fontFamily:
                    "inherit",

                  fontSize:
                    "12px",

                  fontWeight:
                    600,

                  cursor:
                    "pointer",
                }}
              >
                Find My Coffee
              </button>

            )}

          </div>


          {/* ==========================================
              INPUT
          ========================================== */}

          <form
            className="ai-chat-form"
            onSubmit={
              handleSubmit
            }
          >

            <input
              type="text"

              value={
                input
              }

              onChange={(
                event,
              ) =>
                setInput(
                  event.target.value,
                )
              }

              placeholder="Ask about coffee..."

              aria-label="Ask about coffee"

              disabled={
                isLoading
              }
            />


            <button
              type="submit"
              disabled={
                isLoading
              }
            >
              {isLoading
                ? "..."
                : "Send"}
            </button>

          </form>

        </section>

      )}


      {/* ============================================
          CHAT BUTTON
      ============================================ */}

      <button
        type="button"

        className="ai-chat-button"

        onClick={() =>
          setIsOpen(
            (current) =>
              !current,
          )
        }

        aria-label="Open Java coffee assistant"
      >
        ☕
      </button>
    </>
  );
}