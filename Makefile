.PHONY: all clean css cv

# ===================

all: css cv

css: style.css
cv: *.pdf

clean:
	rm -rf *.aux *.log *.out *.pdf style.css

# ===================

style.css: src/style.scss
	sassc -t compressed $< $@

# In the very unlikely event that I would have more than one .tex file.
%.pdf: src/%.tex
	pdflatex $<
