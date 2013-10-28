from distutils.core import setup
import os


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
    name="django-simple-publishing",
    version="0.1.0",
    description="",
    author="Olof Sjöbergh",
    author_email="olofsj@gmail.com",
    maintainer="Olof Sjöbergh",
    maintainer_email="olofsj@gmail.com",
    url="https://github.com/olofsj/django-simple-publishing",
    license="MIT",
    packages=[
        "publishing",
    ],
    long_description=read("README.md"),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Framework :: Django",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
    ],
)
