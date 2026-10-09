import spacy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Will download on startup in a real environment
    nlp = None

analyzer = SentimentIntensityAnalyzer()

def extract_entities_and_sentiment(text: str):
    sentiment = analyzer.polarity_scores(text)
    
    urgency = "Neutral"
    if sentiment['compound'] <= -0.5:
        urgency = "Panic"
    elif sentiment['compound'] <= 0:
        urgency = "Alert"
        
    entities = []
    if nlp:
        doc = nlp(text)
        entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
        
    return {
        "sentiment_score": sentiment['compound'],
        "urgency_level": urgency,
        "extracted_entities": entities
    }
